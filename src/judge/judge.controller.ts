import { exec, execSync}  from 'child_process';
import { Controller, Post, Body, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { diffDomCore, IHTMLSnippet, IDiffResult, Puppeteer } from '@auncel/diff-dom-core/dist/index.pptr';
import debug from 'debug';

@Controller('judge')
export class JudgeController implements OnModuleInit, OnModuleDestroy {
  @Post("/test")
  public async judge(
    @Body('question') question: IHTMLSnippet,
    @Body('anwser')  answer: IHTMLSnippet,
  ): Promise<IDiffResult> {
    return await diffDomCore(question, answer);
  }

  async onModuleInit() {

    await Puppeteer.getPageManager();
  }

  async onModuleDestroy() {
    try {
      execSync('ps -A | grep chrome')
        .toString()
        .split('\n')
        .map(line => line && line.trim().match(/^\d+/)[0])
        .forEach((pid) => { exec(`kill ${pid}`); });
  
      console.log(execSync('ps -A | grep chrome').toString());
    } catch {}
  }
}
