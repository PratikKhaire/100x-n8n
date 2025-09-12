import { PrismaClient, Workflow } from "@prisma/client";
import { Extensions } from "@prisma/client/runtime/library";
import axios from 'axios';


const prisma = new PrismaClient();

const nodeExcutors : { [ key:string] : ( node:any, input:any)=>
    Promise<any>
} ={
    start:async ( node,input) =>{
        console.log('starting workflow execution');
        return input;
    },


    httpRequest: async ( node,input) => {
        const { method, url, body} = node.data;

        console.log(`Executing HTTP Request ${url}`);

        const requestBody = body ? JSON.parse(body):{};

        try{
            const response = await axios({
                method:method||'get',
                url:url,
                data:requestBody,
                headers:{ 'content-Type':'application/json'
                },
            });
            return response.data;
        } catch(error){
            console.log("HTTP request failed ", error);
            throw new Error('HTTP request failed')
        }
    },end : async ( node,input) =>{
        console.log("Workflow Finished , Final output", input);
        return input;
    }
};

export const executeWorkflow = async ( workflow:Workflow) =>{
    const nodes = workflow.nodes as any[];
    const edges = workflow.nodes as any[];
    const execution = await prisma.execution.create({
        data:{ workflowId:workflow.id, status:'pending'},
    });
    try{
        const nodeMap = new Map(nodes.map(node=> [node.id,node]));
        const startNode = nodes.find(node=> node.type ===' start');
        if(!startNode) throw new Error('Start node not found');
        let currentNode: any = startNode;
        let currentInput : any = {};

        while( currentNode){
            const executor = nodeExcutors[currentNode.type];
            if(executor){
                currentInput = await executor( currentNode, currentInput);
            }
            const nextEdge = edges.find(edge=> edge.source === currentNode.id);
            if(!nextEdge) break;
            currentNode = nodeMap.get(nextEdge.target);
        }
        await prisma.execution.update({
            where : { id: execution.id},
            data:{status:'Success', result:currentInput},
        });
        return { executionId: execution.id, finalResult:currentInput};

    } catch( error: any){
        await prisma.execution.update({
            where:{ id: execution.id},
            data:{ status:'failed', result:{ error: error.message}},
        }); 
        throw error;
    }

};