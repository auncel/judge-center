import { Injectable } from '@nestjs/common';
import axios from 'axios';
import LRU from 'lru-cache';
import debug from 'debug';
import { pptrGenerateRenderTree } from '@auncel/diff-dom-core/dist/RenderTree/pptrGenerateRenderTree';
import { ProblemDto } from '../domain';
import { IElementRenderNode } from '@auncel/diff-dom-core/dist/RenderNode';

const log = debug('auncel:judge:JudgeService');

const renderTreeCache = new LRU<number, IElementRenderNode>({
  maxAge: 1000 * 60 * 60 * 24,
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
    const { data: problemData } = await axios.get<ProblemDto>(
      'http://api.auncel.top/problem?id=' + problemId,
    );
    
    log('fetch problem data %o', problemData);
    let renderTree: IElementRenderNode;
    if (problemData.renderTree) {
      renderTree =  JSON.parse(problemData.renderTree) as IElementRenderNode;
    } else {
      log('generate render tree by pptr');
      renderTree = await pptrGenerateRenderTree({html, style});
      // TODO: need implement
      // await axios.post('https://api.auncel.top/problem/', { id: problemId, renderTree });
    }
    renderTreeCache.set(problemId, renderTree);
    return renderTree;
  }

}
