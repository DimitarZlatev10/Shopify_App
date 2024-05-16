import {ChatOpenAI} from '@langchain/openai';
import {PromptTemplate} from "@langchain/core/prompts"
import {JSDOM} from 'jsdom'

import { config } from 'dotenv';
config()
export default async function fixMistakesAndAddIds(sanitizedHtmlString){

    const dom = new JSDOM(sanitizedHtmlString);

    const hTags = dom.window.document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    hTags.forEach(tag => {
        tag.innerHTML = tag.textContent

        const generatedId = tag.textContent.trim().toLocaleLowerCase().split(' ').join('-')

        tag.id = generatedId
    });

    const domWithAddedIds = dom.serialize()

    const model = new ChatOpenAI({
        modelName: "gpt-4-0125-preview",
        temperature: 0,
    });
    const promptTemplate = PromptTemplate.fromTemplate(
      `Correct all spelling and punctuation errors from the html tags text provided below.
       Style them with Tailwind CSS.
       Return me ONLY the div element.
      
      html tags text: 
      {html_tags}
      `
    );
    
    const chain = promptTemplate.pipe(model);
    
    const result = await chain.invoke({ html_tags: domWithAddedIds });

    return result.content
}
