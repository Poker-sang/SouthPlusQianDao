export default {
  /**
   * @param {{ url: string | URL; }} request
   */
  async fetch(request) {
    // 获取请求中的 URL 参数
    const requestUrl = new URL(request.url);
    const cookies = requestUrl.searchParams.get('cookie');
    const ua = requestUrl.searchParams.get('ua');
    const pwd = requestUrl.searchParams.get('pwd');
    if (pwd !== *** /* YourPassword */) {
      return new Response('Wrong Or Missing Password', { status: 401 });
    }

    if (!cookies) {
      return new Response('Missing "cookie" parameter', { status: 400 });
    }

    if (!ua) {
      return new Response('Missing "ua" parameter', { status: 400 });
    }

    const url = 'https://www.south-plus.net/plugin.php';

    const headers = {
      'User-Agent': ua,
      'Cookie': cookies,
    };

    async function getInfo(responseText) {
      const match = responseText.match(/(?<=!\[CDATA\[).*(?=\]\])/);
      return match ? match[0] : responseText;
    }

    async function performTask(params) {
      const urlParams = new URLSearchParams(params).toString();
      const response = await fetch(`${url}?${urlParams}`, { headers });
      return getInfo(await response.text());
    }

    var result = '\n';
    var is202 = false;

    try {
      result += '\n日常任务';
      const daily = await performTask({
        H_name: 'tasks',
        action: 'ajax',
        actions: 'job',
        cid: '15',
        nowtime: '1672151938011',
        verify: 'f2807318',
      });
      result += '\n';
      result += daily;

      if (daily.includes('没有登录')) {
        throw new Error('您还没有登录或注册，暂时不能使用此功能!!');
      }

      result += '\n';
      if (daily.includes('success')) {
        result += await performTask({
          H_name: 'tasks',
          action: 'ajax',
          actions: 'job2',
          cid: '15',
          nowtime: '1672152113906',
          verify: 'f2807318',
        });
      } else {
        result += 'Skipped'
        is202 = true;
      }

      result += '\n周常任务';
      const weekly = await performTask({
        H_name: 'tasks',
        action: 'ajax',
        actions: 'job',
        cid: '14',
        nowtime: '1673581486261',
        verify: '42cb3e60',
      });
      result += '\n';
      result += weekly;

      result += '\n';
      if (weekly.includes('success')) {
        result += await performTask({
          H_name: 'tasks',
          action: 'ajax',
          actions: 'job2',
          cid: '14',
          nowtime: '1673581486561',
          verify: '42cb3e60',
        });
      } else {
        result += 'Skipped'
      }

      result += '\n新年红包';
      const redPocket = await performTask({
        H_name: 'tasks',
        action: 'ajax',
        actions: 'job',
        cid: '19',
        nowtime: '1672570369699',
        verify: 'f2807318',
      });
      result += '\n';
      result += redPocket;

      result += '\n';
      if (redPocket.includes('success')) {
        result += await performTask({
          H_name: 'tasks',
          action: 'ajax',
          actions: 'job2',
          cid: '19',
          nowtime: '1672570470977',
          verify: 'f2807318',
        });
      } else {
        result += 'Skipped'
      }

      return new Response('全部成功' + result, { status: is202 ? 202 : 200 });
    } catch (error) {
      return new Response(error.message + result, { status: 500 });
    }
  }
};