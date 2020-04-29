/* --------------------------------------------------------------------------*
 * Description:                                                              *
 *                                                                           *
 * File Created: Tuesday, 28th April 2020 9:22 pm                            *
 * Author: yidafu(dov-yih) (me@yidafu.dev)                                   *
 *                                                                           *
 * Last Modified: Tuesday, 28th April 2020 9:22 pm                           *
 * Modified By: yidafu(dov-yih) (me@yidafu.dev>)                             *
 *                                                                           *
 * Copyright 2019 - 2020 Mozilla Public License 2.0                          *
 *-------------------------------------------------------------------------- */
import axios from 'axios';
import debug from 'debug';
import { Controller, Post, Body, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { diffDomCore, getRenderTree, IDiffResult, Puppeteer } from '@auncel/diff-dom-core/dist/index.pptr';
import { createHTMLTpl } from '@auncel/diff-dom-core/dist/utils';
import { exec, execSync}  from 'child_process';
import {
  performance,
}  from 'perf_hooks';
import { IReponseResult } from '../ReponseResult.interface';
import { API_HOST, VALIDATE_ERROR, PASS_LINE } from './constant';
import { SubmissionDto, SubmissionStatus } from '../domain';

export interface IJudgeResult {
  success: boolean;
  code: number;
  msg: string;
  data?: IDiffResult;
}

async function createSubmission(judgeData: IJudgeSubmission): Promise<SubmissionDto> {
  const { problemId, userId, html, style} = judgeData;
  const { data: { data: submissionData } } = await axios.post<IReponseResult<SubmissionDto>>(
    `${API_HOST}/submission`,
    {
      html,
      style,
      problem: { id: problemId },
      submiter: { id: userId },
    },
  );
  return submissionData;
}

async function updateSubmission(submission: SubmissionDto): Promise<boolean> {
  const { data: { data: isUpdate } } = await axios.put<IReponseResult<boolean>>(
    `${API_HOST}/submission`, submission,
  );
  return isUpdate;
}

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

  @Post("/submit")
  public async judge(
    @Body() judgeData: IJudgeSubmission,
    ): Promise<IJudgeResult> {
      const { problemId, html, style} = judgeData;
      const submissionData = await createSubmission(judgeData);

      const htmlTpl = createHTMLTpl(html, style)
      const res = this.judgeSerice.validate(htmlTpl);
      if (!res.valid) {
        submissionData.status = SubmissionStatus.SYNTAX_ERROR;
      submissionData.logs = res.results;
      await updateSubmission(submissionData);
      return { success: false, code: VALIDATE_ERROR, msg: '存在语法，请检查后重新提交！' };
    }
    
    const question = await this.judgeSerice.getQuestionTree(problemId, html, style);
    
    const judgeStart = performance.now();

    const answer = await getRenderTree({ html, style })
    
    submissionData.renderTree = JSON.stringify(answer);
    log('update sumission renderTree %s', submissionData.renderTree);
    await updateSubmission(submissionData);

    const diffRes = await diffDomCore(question, answer)

    const judgeEnd = performance.now();

    submissionData.score = diffRes.score;
    submissionData.status = diffRes.score > PASS_LINE ? SubmissionStatus.ACCEPT : SubmissionStatus.WRONG_ANWSER;
    submissionData.logs = JSON.stringify(diffRes.logs);
    submissionData.exeTime = judgeEnd - judgeStart;
    log('submission data after diff %o', submissionData);
    await updateSubmission(submissionData);

    return { success: true, code: 0, msg: `判题成功， 得分：${diffRes.score}分`, data: diffRes};
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
