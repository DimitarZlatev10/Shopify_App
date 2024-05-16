import {ChatOpenAI} from '@langchain/openai';
import {PromptTemplate} from "@langchain/core/prompts"
import {JSDOM} from 'jsdom'


import { config } from 'dotenv';
config()

export default async function generateTableOfContents(sanitizedHtmlString){

    const dom = new JSDOM(sanitizedHtmlString);

    const hTags = dom.window.document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    const allHTags = []

    hTags.forEach(tag => {
        const generatedId = `#${tag.textContent.trim().toLocaleLowerCase().split(' ').join('-')}`

        tag.id = generatedId

        allHTags.push(tag.outerHTML)
    });

    const model = new ChatOpenAI({
        modelName: "gpt-4-0125-preview",
        temperature: 0,
    });
    const promptTemplate = PromptTemplate.fromTemplate(
      `Generate me a table of contents with the given html tags below.
      Remove any unnecessary elements for example (- or :), the link should have only one (-) in between the spaces
      Style them with Tailwind CSS.
      Return me ONLY the div element.
      
      html tags: 
      {html_tags}
      `
    );
    
    const chain = promptTemplate.pipe(model);
    
    const result = await chain.invoke({ html_tags: allHTags });
    
    return result.content
}
