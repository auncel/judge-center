import { exec, execSync}  from 'child_process';
import { Controller, Post, Body, OnModuleInit, OnModuleDestroy, Inject, HttpService } from '@nestjs/common';
import { diffDomCore, IHTMLSnippet, IDiffResult, Puppeteer } from '@auncel/diff-dom-core/dist/index.pptr';
import debug from 'debug';
import { JudgeService } from './judge.service';

const log = debug('auncel:judge:JudgeController');

interface IJudgeSubmission {
  problemId: number;
  userId: number;
  html: string;
  style: string;
}

@Controller('judge')
export class JudgeController implements OnModuleInit, OnModuleDestroy {

  @Inject()
  judgeSerice: JudgeService;

  @Post("/")
  public async judge(
    @Body() judgeData: IJudgeSubmission,
  ): Promise<IDiffResult> {
    const { problemId, userId, html, style} = judgeData;
    const question = await this.judgeSerice.getQuestionTree(problemId, html, style);
    const answer = { html, style };
      console.time('diffDomCore');
    const diffRes = await diffDomCore(question, answer)
      console.timeEnd('diffDomCore');
    return diffRes;
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
      } catch {}
  }
}
