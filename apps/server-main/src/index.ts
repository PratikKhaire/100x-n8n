import express from 'express';
import cors from 'cors';
import { executeWorkflow } from '@8n8/engine';
import { prisma } from './db';


const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
    res.send('n8n-clone is backend is running');
});

app.post('/workflow/execute',(req,res)=>{
    const workflow = req.body;
    console.log("Received workflow:", workflow);

     try {
    const result = executeWorkflow(workflow);
    res.json({ status: 'success', message: result, workflow: workflow });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
})

app.post('/api/v1/workflows', async ( req , res)=>{
  try{
    const { name, nodes,edges} = req.body;
    const workflow = await prisma.workflow.create({
      data:{
        name,
        nodes,
        edges,
      },
    });
    res.status(201).json(workflow);

  } catch(error){
    console.log("Failed to create workflow", error);
    res.status(500).json({ message: 'failed to create workflow' });
  }
});



app.get('/api/v1/workflows', async ( req , res)=>{
  try{
    const workflows = await prisma.workflow.findMany();
    res.status(200).json(workflows);
  } catch(error){
    console.log("failed to retrieve workflows", error);
    res.status(500).json({ message: 'failed to retrieve workflows' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
