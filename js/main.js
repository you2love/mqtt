// MQTT 教程 - 主 JavaScript 文件

document.addEventListener('DOMContentLoaded', function() {
    // 语言标签切换
    const langTabs = document.querySelectorAll('.lang-tab');
    const pythonExamples = document.querySelector('.python-examples');
    const goExamples = document.querySelector('.go-examples');
    
    if (langTabs.length > 0) {
        langTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 移除所有活动状态
                langTabs.forEach(t => t.classList.remove('active'));
                // 添加当前活动状态
                this.classList.add('active');
                
                // 切换示例显示
                const lang = this.dataset.lang;
                if (lang === 'python') {
                    pythonExamples.style.display = 'block';
                    goExamples.style.display = 'none';
                } else if (lang === 'go') {
                    pythonExamples.style.display = 'none';
                    goExamples.style.display = 'block';
                }
            });
        });
    }
    
    // 代码块折叠和复制功能
    const codeBlocks = document.querySelectorAll('.code-block');
    codeBlocks.forEach((block, index) => {
        // 创建头部栏
        const header = document.createElement('div');
        header.className = 'code-block-header';
        
        const title = document.createElement('span');
        title.className = 'code-block-title';
        title.textContent = '代码示例 ' + (index + 1);
        
        const toggle = document.createElement('span');
        toggle.className = 'code-block-toggle';
        toggle.textContent = '展开/折叠';
        
        header.appendChild(title);
        header.appendChild(toggle);
        
        // 获取代码内容
        const pre = block.querySelector('pre');
        const code = pre ? pre.querySelector('code') : null;
        
        // 创建内容容器
        const content = document.createElement('div');
        content.className = 'code-block-content';
        if (pre) {
            content.appendChild(pre.cloneNode(true));
        }
        
        // 创建复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = '复制';
        copyBtn.style.cssText = `
            position: absolute;
            right: 10px;
            top: 10px;
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 10;
        `;
        
        // 设置样式
        block.style.position = 'relative';
        
        // 清空并重新组装
        const originalContent = block.innerHTML;
        block.innerHTML = '';
        block.appendChild(header);
        block.appendChild(content);
        
        // 恢复原始内容到 content 中（如果还没有）
        if (!content.querySelector('pre')) {
            content.innerHTML = originalContent;
        }
        
        // 添加复制按钮到 content
        content.style.position = 'relative';
        content.appendChild(copyBtn);
        
        // 折叠/展开功能
        header.addEventListener('click', function(e) {
            if (e.target !== copyBtn) {
                block.classList.toggle('collapsed');
                const isCollapsed = block.classList.contains('collapsed');
                toggle.textContent = isCollapsed ? '点击展开' : '展开/折叠';
            }
        });
        
        // 鼠标悬停显示复制按钮
        content.addEventListener('mouseenter', () => {
            copyBtn.style.opacity = '1';
        });
        
        content.addEventListener('mouseleave', () => {
            copyBtn.style.opacity = '0';
        });
        
        // 复制功能
        copyBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const codeElement = content.querySelector('code') || content.querySelector('pre');
            if (codeElement) {
                try {
                    await navigator.clipboard.writeText(codeElement.textContent);
                    copyBtn.textContent = '已复制!';
                    setTimeout(() => {
                        copyBtn.textContent = '复制';
                    }, 2000);
                } catch (err) {
                    console.error('复制失败:', err);
                    copyBtn.textContent = '复制失败';
                }
            }
        });
    });
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // 添加卡片悬停效果增强
    const cards = document.querySelectorAll('.feature-card, .qos-card, .packet-byte');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
    
    // 序列图动画
    const sequenceDiagrams = document.querySelectorAll('.sequence-diagram');
    sequenceDiagrams.forEach(diagram => {
        const messages = diagram.querySelectorAll('.message');
        messages.forEach((msg, index) => {
            msg.style.opacity = '0';
            msg.style.transform = 'translateX(-20px)';
            msg.style.transition = `opacity 0.3s ease ${index * 0.1}s, transform 0.3s ease ${index * 0.1}s`;
            
            // 使用 IntersectionObserver 触发动画
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        msg.style.opacity = '1';
                        msg.style.transform = 'translateX(0)';
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(msg);
        });
    });
    
    // 当前页面导航高亮
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
    
    // 代码语法高亮（简单实现）
    const codeElements = document.querySelectorAll('code');
    codeElements.forEach(code => {
        // 检查是否在代码块内
        if (code.closest('.code-block')) {
            highlightCode(code);
        }
    });
});

// 简单的代码高亮函数
function highlightCode(codeElement) {
    let html = codeElement.innerHTML;
    
    // 关键字高亮
    const keywords = [
        'import', 'from', 'def', 'class', 'return', 'if', 'else', 'elif',
        'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'in',
        'not', 'and', 'or', 'True', 'False', 'None', 'async', 'await',
        'package', 'func', 'var', 'const', 'type', 'struct', 'interface',
        'go', 'defer', 'select', 'case', 'switch', 'default', 'break',
        'continue', 'fallthrough', 'range', 'chan', 'map', 'slice'
    ];
    
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        html = html.replace(regex, `<span class="keyword">${keyword}</span>`);
    });
    
    // 字符串高亮
    html = html.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '<span class="string">$&</span>');
    
    // 注释高亮
    html = html.replace(/(#|\/\/)(.*)$/gm, '<span class="comment">$1$2</span>');
    
    // 数字高亮
    html = html.replace(/\b\d+(\.\d+)?\b/g, '<span class="number">$&</span>');
    
    codeElement.innerHTML = html;
}

// 添加代码高亮样式
const style = document.createElement('style');
style.textContent = `
    .keyword { color: #569cd6; }
    .string { color: #ce9178; }
    .comment { color: #6a9955; font-style: italic; }
    .number { color: #b5cea8; }
    .copy-btn:hover {
        background: rgba(255,255,255,0.3) !important;
    }
`;
document.head.appendChild(style);

// 控制台欢迎信息
console.log(`
╔════════════════════════════════════════╗
║     MQTT 协议教程 - 开发者指南          ║
║     MQTT Tutorial - Developer Guide    ║
╚════════════════════════════════════════╝

欢迎学习 MQTT 协议！
Pages:
  - index.html      协议概述
  - protocol.html   协议交互
  - packet.html     数据包构建
  - applications.html 常见应用
  - examples.html   代码示例

`);
