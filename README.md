# 南+签到

## 修改于： [cccp6/SouthPlusQianDao_WebDriver](https://github.com/cccp6/SouthPlusQianDao_WebDriver/)

- 将 API 获取改为了简单、粗暴、无脑的 Invoke-WebRequest
- 在CloudFlare创建worker（计算），内容为[worker.js](worker.js)（文件中需要修改为自己指定的密码）
- 并修改[script.ps1](script.ps1)中使用的网址为worker的网址
- 在 **Settings > Secret and variables > Actions > Repository secrets** 中设置好 **COOKIE**（需要 Chrome 格式）、**PWD**（worker.js文件中自己指定的，防止被他人使用worker）和**UA**（User-Agent）。
- 运行 Action 即可

### 注意

- User-Agent必须和获取Cookie浏览器的User-Agent完全相同，否则会报错“您还没有登录或注册，暂时不能使用此功能!!”
- Cookie的获取
  ![图片](https://github.com/user-attachments/assets/2c010da4-0078-4426-8084-ffd7c7540876)
- 经过*前人*测试得出，cookies只需要eb9e6_winduser与eb9e6_cknum两个即可，其他可以删除。有效期是一年。
