export default {
  async fetch(request, env, ctx) {
    // 获取请求中的 URL 参数
    const requestUrl = new URL(request.url);
    const pwd = requestUrl.searchParams.get("pwd");
    const cookies = requestUrl.searchParams.get("cookie");
    const ua = requestUrl.searchParams.get("ua");
    
    if (pwd !== *** /* YourPassword */) {
      return new Response("Wrong Or Missing Password", { status: 401 });
    }
    
    if (!cookies) {
      return new Response("Missing 'cookie' parameter", { status: 400 });
    }

    if (!ua) {
      return new Response("Missing 'ua' parameter", { status: 400 });
    }

    const url = 'https://www.south-plus.net/plugin.php';

    const headers = {
      'User-Agent': ua,
      "Cookie": cookies,
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

    var result = "\n";
    var is202 = false;

    try {
      const dailyStamp = await env.QIANDAO_BINDING.get("daily");
      if (dailyStamp === null) {
        return new Response("'daily' Value not found", { status: 404 });
      }
      const dailySpanHours = (Date.now() - dailyStamp) / 1000 / 60 / 60; // 小时
      if (dailySpanHours > 18.2)
      {
        result += '\n日常任务';
        const dailyReceiveResult = await performTask({
          H_name: 'tasks',
          action: 'ajax',
          actions: 'job',
          cid: '15',
          nowtime: '1672151938011',
          verify: 'f2807318',
        });
        result += '\n';
        result += dailyReceiveResult;

        if (dailyReceiveResult.includes("没有登录")) {
          return new Response(result, { status: 401 });
        }

        result += '\n';
        if (dailyReceiveResult.includes("success")) {
          const dailyCompleteResult = await performTask({
            H_name: 'tasks',
            action: 'ajax',
            actions: 'job2',
            cid: '15',
            nowtime: '1672152113906',
            verify: 'f2807318',
          });
          result += dailyCompleteResult;
          if (dailyCompleteResult.includes("success")) {
            await env.QIANDAO_BINDING.put("daily", Date.now());
          }
        } else {
          result += "Skipped"
          is202 = true;
        }

        // 新年红包单独请求，和每日签到共享冷却
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
        if (redPocket.includes("success")) {
          result += await performTask({
            H_name: 'tasks',
            action: 'ajax',
            actions: 'job2',
            cid: '19',
            nowtime: '1672570470977',
            verify: 'f2807318',
          });
        } else {
          result += "Skipped"
        }
      }
      else
      {
        result += "Skipped: KV内部记录日常未满18小时";
      }

      const weeklyStamp = await env.QIANDAO_BINDING.get("weekly");
      if (weeklyStamp === null) {
        return new Response("'weekly' Value not found", { status: 404 });
      }
      const weeklySpanHours = (Date.now() - weeklyStamp) / 1000 / 60 / 60; // 小时
      if (weeklySpanHours > 158.5)
      {
        result += '\n周常任务';
        const weeklyReceiveResult = await performTask({
          H_name: 'tasks',
          action: 'ajax',
          actions: 'job',
          cid: '14',
          nowtime: '1673581486261',
          verify: '42cb3e60',
        });
        result += '\n';
        result += weeklyReceiveResult;

        result += '\n';
        if (weeklyReceiveResult.includes("success")) {
          const weeklyCompleteResult = await performTask({
            H_name: 'tasks',
            action: 'ajax',
            actions: 'job2',
            cid: '14',
            nowtime: '1673581486561',
            verify: '42cb3e60',
          });
          result += weeklyCompleteResult;
          if (weeklyCompleteResult.includes("success")) {
            await env.QIANDAO_BINDING.put("weekly", Date.now());
          }
        } else {
          result += "Skipped"
        }
      }
      else
      {
        result += "Skipped: KV内部记录周常未满158小时";
      }

      return new Response("全部成功" + result, { status: is202 ? 202 : 200 });
    } catch (error) {
      return new Response(error.message + result, { status: 500 });
    }
  }
};
