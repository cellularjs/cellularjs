/**
 * @see https://cellularjs.com/docs/foundation/dependency-injection/module#51-oninit
 * @since 0.1.0
 */
export interface OnInit {
  onInit(): Promise<any> | any;
}
