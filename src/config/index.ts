/* --------------------------------------------------------------------------*
 * Description:                                                              *
 *                                                                           *
 * File Created: Sunday, 8th March 2020 9:58 pm                              *
 * Author: yidafu(dov-yih) (me@yidafu.dev)                                   *
 *                                                                           *
 * Last Modified: Sunday, 8th March 2020 9:58 pm                             *
 * Modified By: yidafu(dov-yih) (me@yidafu.dev>)                             *
 *                                                                           *
 * Copyright 2019 - 2020 Mozilla Public License 2.0                          *
 *-------------------------------------------------------------------------- */

const isLocal = process.env.NODE_ENV !== 'production';
export const MICRO_SERVICE_TCP_HOST: string = isLocal ? '127.0.0.1' : '101.37.29.47';
export const MICRO_SERVICE_TCP_PORT: number = isLocal ? 6301 : 6301;