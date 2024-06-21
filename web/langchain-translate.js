
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { config } from 'dotenv'
import { writeToFile } from "./frontend/utils/fileWriter.js";

config()

export async function langchain(allProducts, language) {

    const model = new ChatOpenAI({
        modelName: 'gpt-4o',
        temperature: 0,
    });

    const promptTemplate = PromptTemplate.fromTemplate(
        `Translate this html string {string} from Bulgarian to ${language} and keep its original structure. Output ONLY the translated html text dont add additional values.`
    );

    const chain = promptTemplate.pipe(model);

    for (let product of allProducts) {
        const sections = [];
        const splitSections = product.descriptionHtml.split("</section>");

        splitSections.forEach((splitSection, index) => {
            if (index !== splitSections.length - 1) {
                splitSection = `${splitSection.trim()}</section>`;
            } else {
                splitSection = splitSection.trim(); 
            }
            if (splitSection) {
                sections.push({ string: splitSection });
            }
        });

        const result = await chain.batch(sections);

        const translatedHtml = [];

        result.forEach((res) => {
            translatedHtml.push(res.content);
        });

        let final = translatedHtml.join("");

        final = final.replace(/```html/g, '').replace(/```/g, '');

        product.descriptionHtml = final 
    }

    writeToFile(allProducts , `Products-${language}.txt`)

    console.log(allProducts);
}

