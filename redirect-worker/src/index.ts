// 301 redirect worker — sits on metaforikikefalonias.gr (and any other
// keyword/EMD redirect domains we register) and forwards all traffic to the
// canonical brand domain spathismetaforiki.gr while preserving path + query.
// Deploy: wrangler deploy (from this directory).

const TARGET_ORIGIN = 'https://spathismetaforiki.gr';

export default {
  fetch(request: Request): Response {
    const url = new URL(request.url);
    const target = `${TARGET_ORIGIN}${url.pathname}${url.search}`;
    return Response.redirect(target, 301);
  },
};
