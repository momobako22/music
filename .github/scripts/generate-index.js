const fs = require('fs');
const fetch = require('node-fetch');
const marked = require('marked');

async function generateIndex() {
  // 获取 Issues
  const response = await fetch('https://api.github.com/repos/momobako22/momobako22.github.io/issues', {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });
  const issues = await response.json();

  // 生成 HTML
  let postsHtml = '';
  if (issues.length === 0) {
    postsHtml = '<p>暂无博客文章</p>';
  } else {
    postsHtml = issues.map(issue => `
      <div class="post-card">
        <h2>${issue.title}</h2>
        <div class="meta">发布于 ${new Date(issue.created_at).toLocaleDateString('zh-CN')}</div>
        <div class="content">${marked.parse(issue.body || '')}</div>
        <div class="labels">
          ${issue.labels.map(label => `<span class="label">${label.name}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // 完整 HTML
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>音乐主页 - 博客</title>
    <link rel="stylesheet" href="styles/main.css">
    <style>
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 40px;
        }
        .post-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
        }
        .post-card {
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            padding: 20px;
            width: 300px;
            text-align: left;
        }
        .post-card h2 {
            font-size: 1.2em;
            color: #333;
            margin: 10px 0;
        }
        .post-card .meta {
            font-size: 0.8em;
            color: #999;
            margin-bottom: 10px;
        }
        .post-card .content {
            font-size: 0.9em;
            color: #666;
        }
        .post-card .labels {
            margin-top: 10px;
        }
        .post-card .label {
            display: inline-block;
            background: #007bff;
            color: #fff;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            margin-right: 5px;
        }
        .nav-links {
            text-align: center;
            margin: 20px 0;
        }
        .nav-links a {
            margin: 0 10px;
        }
        @media (max-width: 600px) {
            .post-card {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <h1>音乐主页 - 博客</h1>
    <div class="nav-links">
        <a href="songs.html">所有歌曲</a>
        <a href="multi-song1.html">精选歌曲</a>
        <a href="song1.html">单曲：お見舞いフェラ</a>
    </div>
    <div class="post-container">
        ${postsHtml}
    </div>
</body>
</html>
  `;

  console.log(html);
}

generateIndex();
