/**
 * This is just a sample, you need to remove it.
 */

import { Cell } from '@cellularjs/net';
import { CommonModule } from '$share/common';

@Cell({
  providers: ['./'],
  imports: [CommonModule],
  listen: './',
})
export class User {}
