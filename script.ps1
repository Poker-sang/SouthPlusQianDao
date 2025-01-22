param (
    [string]$myPwd,
    [string]$cookie,
    [string]$ua
)

# 构建URL
$url = "https://south-plus.poker-sang.workers.dev/?pwd=$myPwd&cookie=$cookie&ua=$ua"

try {
    # 发送GET请求
    $response = Invoke-WebRequest -Uri $url -Method Get

    # 检查状态码
    if ($response.StatusCode -eq 202) {
        Write-Output $true
    } else {
        Write-Output $false
    }
} catch {
    # 捕获异常并返回true
    Write-Output $true
}