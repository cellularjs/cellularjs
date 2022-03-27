 export default (function () {
  //  console.log('aaaa1')
  //  if (!window) {
  //    return null;
  //  }
  //  console.log('aaa2')
 
   return {
     onRouteUpdate(ctx) {
      //  console.log('window.ga', window.ga)
       // Set page so that subsequent hits on this page are attributed
       // to this page. This is recommended for Single-page Applications.
      //  window.ga('set', 'page', ctx.location.pathname);
      //  // Always refer to the variable on window in-case it gets
      //  // overridden elsewhere.
      //  window.ga('send', 'pageview');
     },
   };
 })();