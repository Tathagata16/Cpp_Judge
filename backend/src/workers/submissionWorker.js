import { Worker } from "bullmq";
import Redis from "ioredis";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import { runCppCode } from "../services/judge.js";
import {connectDB} from '../services/db.js'
import dotenv from 'dotenv'


dotenv.config();
await connectDB();
// console.log("Worker DB connected");

const connection = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379',{
    maxRetriesPerRequest: null,
});



const worker = new Worker('submission-queue', async (job) => {
    const { submissionId, problemSlug, code } = job.data;

    try{
        const problem = await Problem.findOne({ slug: problemSlug });
        if (!problem) throw new Error('Problem not found');

        //execute code against ALL test cases (including hidden)
        const { passed, results, error } = await runCppCode(code, problem.testCases);

        //determine final status
        let status = 'Accepted';
        if (error) {
            status = error.includes('error:') ? 'Compile Error' : 'Runtime Error';
        } else if (!passed) {
            const tle = results.find(r => r.got === 'Time Limit Exceeded');
            status = tle ? 'Time Limit Exceeded' : 'Wrong Answer';
        }

        //update submission in DB
        const saved = await Submission.findByIdAndUpdate(submissionId, {
            status,
            results,
            error,
        });
        
        if(saved){
            console.log("saved the code in db");
        }

    }catch(err){
        console.error(`Error processing submission ${submissionId}:`, err);
        await Submission.findByIdAndUpdate(submissionId, {
            status: 'Runtime error',
            error: err.message,
        });
    }

},{ connection });
    












