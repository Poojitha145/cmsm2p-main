import puppeteer from "puppeteer";
import fs from 'fs';
import path from 'path';
import underscore from 'underscore';

const Freemarker = require('freemarker');

export class StatementHtmlTemplate {
    private readonly template: string;
    private readonly freemarker = new Freemarker();
    constructor() {
        let filePath: string = path.join(__dirname, '..', '..', '..',
            'src', 'resources', 'templates', 'statement-pdf.html');
        this.template = fs.readFileSync(filePath, 'utf8');
    }

    getTemplate(): string {
        return this.template.slice();
    }

    formatContent(data: any): Promise<any> {
        return new Promise<any>(async (resolve: any, reject: any) => {
            this.freemarker.render(this.getTemplate(), data, (e: any, result: any) => {
                if (e) {
                    reject('Unable to format statement content' + e);
                }
                resolve(result);
            });
        });
    }
}

export class StatementUtil {

    private static readonly pdfDefaultConfig: any = {
        path: '',
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: false,
        margin: {
            left: '0',
            top: '0',
            right: '0',
            bottom: '0'
        }

    }

    public static async generatePdf(htmlContent: string, options?: {
        path: string,
        scale?: number,
        format?: string,
        width?: string,
        height?: string
    }): Promise<any> {
        // const pdfConfig: any = underscore.extend({}, this.pdfDefaultConfig, options);
        const browser = await puppeteer.launch();

        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'load' });
        
        // Note - not storing into local directory.
        const buffer: any = await page.pdf({});
        // TODO - to store locally
        // const buffer: any = await page.pdf(pdfConfig);
        await browser.close();

        return buffer;
    }


    public static async formatTemplate(htmlContent: string, options: {
        outputPath: string,
        format?: 'A4'
    }) {

    }
}