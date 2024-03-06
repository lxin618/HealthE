import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config'

const Openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

export default Openai