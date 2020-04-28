import { Injectable } from '@nestjs/common';
import axios from 'axios';
import LRU from 'lru-cache';
import { HtmlValidate, Report } from "html-validate";
import jsonFormatter from 'html-validate/build/formatters/json';
import debug from 'debug';
import { pptrGenerateRenderTree } from '@auncel/diff-dom-core/dist/RenderTree/pptrGenerateRenderTree';
import { IElementRenderNode } from '@auncel/diff-dom-core/dist/RenderNode';
import { IHTMLSnippet } from '@auncel/diff-dom-core/dist/index.pptr';
import { createHTMLTpl } from '@auncel/diff-dom-core/dist/utils'
import { ProblemDto, SubmissionDto } from '../domain';
import { API_HOST } from './constant';
import { IReponseResult } from '../ReponseResult.interface';

export interface IValidataReport {
  valid: boolean;
  results: string;
}

const log = debug('auncel:judge:JudgeService');

const BASE_URL = API_HOST + '/problem';
const renderTreeCache = new LRU<number, IElementRenderNode>({
  maxAge: 1000 * 60,
});

const htmlvalidate = new HtmlValidate({
  extends: ['html-validate:recommended'],
});


@Injectable()
export class JudgeService {

  public async getQuestionTree(
    problemId: number, html?: string, style?: string
  ): Promise<IElementRenderNode> {
    if (renderTreeCache.has(problemId)) {
      log('problem: %d hit cache', problemId)
      return renderTreeCache.get(problemId);
    }
    log('problem %d doesn\'t hit cache', problemId);
    // FIXME: don't destructuring assignment nested
    const { data: { data: problemData} } = await axios.get<IReponseResult<ProblemDto>>(
      BASE_URL + '?id=' + problemId,
    );
    
    log('fetch problem data %o ', problemData);
    let renderTree: IElementRenderNode;
    if (problemData.renderTree) {
      renderTree =  JSON.parse(problemData.renderTree) as IElementRenderNode;
    } else {
      log('generate render tree by pptr');
      renderTree = await pptrGenerateRenderTree({html, style});
      // TODO: need implement
      await axios.put(BASE_URL, {
        id: problemId,
        renderTree: JSON.stringify(renderTree),
      });
    }
    renderTreeCache.set(problemId, renderTree);
    return renderTree;
  }

  validate(html: string): IValidataReport {
    const report = htmlvalidate.validateString(html);
    const jsonResult = jsonFormatter(report.results);
    const validReport: IValidataReport = {
      valid: report.valid,
      results: jsonResult,
    }
    log('html validate report %o', report);
    return validReport;
  }

}
