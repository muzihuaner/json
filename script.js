// 编辑器实例
let inputEditor, outputEditor;
let isDark = false;

// 初始化编辑器
document.addEventListener('DOMContentLoaded', () => {
    // 创建输入编辑器
    inputEditor = CodeMirror(document.getElementById('inputEditor'), {
        mode: 'application/json',
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: false,
        matchBrackets: true,
        autoCloseBrackets: true,
        tabSize: 2,
        gutters: ['CodeMirror-linenumbers'],
    });

    // 创建输出编辑器
    outputEditor = CodeMirror(document.getElementById('outputEditor'), {
        mode: 'application/json',
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: false,
        matchBrackets: true,
        readOnly: true,
        tabSize: 2,
        gutters: ['CodeMirror-linenumbers'],
    });

    // 初始化事件监听器
    initializeEventListeners();
    setupDragAndDrop();
});

// 初始化事件监听器
function initializeEventListeners() {
    // 格式化按钮
    document.getElementById('formatBtn').addEventListener('click', formatCode);

    // 压缩按钮
    document.getElementById('minifyBtn').addEventListener('click', minifyCode);

    // 复制按钮
    document.getElementById('copyBtn').addEventListener('click', copyToClipboard);

    // 下载按钮
    document.getElementById('downloadBtn').addEventListener('click', downloadOutput);

    // 格式类型选择
    document.getElementById('formatType').addEventListener('change', updateEditorMode);

    // 换行选项
    document.getElementById('wrapLines').addEventListener('change', (e) => {
        const wrap = e.target.checked;
        inputEditor.setOption('lineWrapping', wrap);
        outputEditor.setOption('lineWrapping', wrap);
    });

    // 行号选项
    document.getElementById('showLineNumbers').addEventListener('change', (e) => {
        const show = e.target.checked;
        inputEditor.setOption('lineNumbers', show);
        outputEditor.setOption('lineNumbers', show);
    });

    // 主题切换
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // 实时错误检查
    inputEditor.on('change', () => {
        validateInput();
    });
}

// 格式化代码
function formatCode() {
    try {
        const input = inputEditor.getValue();
        const formatType = document.getElementById('formatType').value;
        let output = '';

        if (formatType === 'json') {
            // 如果输入是 YAML，先转换为 JSON
            if (isYaml(input)) {
                const jsonData = jsyaml.load(input);
                output = JSON.stringify(jsonData, null, 2);
            } else {
                // 解析并格式化 JSON
                const jsonData = JSON.parse(input);
                output = JSON.stringify(jsonData, null, 2);
            }
        } else {
            // 如果输入是 JSON，转换为 YAML
            const jsonData = isYaml(input) ? jsyaml.load(input) : JSON.parse(input);
            output = jsyaml.dump(jsonData, {
                indent: 2,
                lineWidth: -1,
                noRefs: true,
                sortKeys: true
            });
        }

        outputEditor.setValue(output);
        hideError();
    } catch (error) {
        showError(error.message);
    }
}

// 压缩代码
function minifyCode() {
    try {
        const input = inputEditor.getValue();
        const formatType = document.getElementById('formatType').value;
        let output = '';

        if (formatType === 'json') {
            // 如果输入是 YAML，先转换为 JSON
            if (isYaml(input)) {
                const jsonData = jsyaml.load(input);
                output = JSON.stringify(jsonData);
            } else {
                const jsonData = JSON.parse(input);
                output = JSON.stringify(jsonData);
            }
        } else {
            // 如果输入是 JSON，转换为压缩的 YAML
            const jsonData = isYaml(input) ? jsyaml.load(input) : JSON.parse(input);
            output = jsyaml.dump(jsonData, {
                indent: 0,
                lineWidth: -1,
                noRefs: true,
                flowLevel: 0
            });
        }

        outputEditor.setValue(output);
        hideError();
    } catch (error) {
        showError(error.message);
    }
}

// 复制到剪贴板
async function copyToClipboard() {
    const content = outputEditor.getValue();
    try {
        await navigator.clipboard.writeText(content);
        showTemporaryMessage('已复制到剪贴板');
    } catch (error) {
        showError('复制失败：' + error.message);
    }
}

// 下载输出
function downloadOutput() {
    const content = outputEditor.getValue();
    const formatType = document.getElementById('formatType').value;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `formatted_${timestamp}.${formatType}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// 切换主题
function toggleTheme() {
    isDark = !isDark;
    document.documentElement.classList.toggle('dark');
    const theme = isDark ? 'monokai' : 'default';
    inputEditor.setOption('theme', theme);
    outputEditor.setOption('theme', theme);
}

// 设置拖放功能
function setupDragAndDrop() {
    const dropZone = document.getElementById('inputEditor');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drag-over');
        });
    });

    dropZone.addEventListener('drop', handleDrop);
}

// 处理文件拖放
function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            inputEditor.setValue(event.target.result);
            validateInput();
        };

        reader.readAsText(file);
    }
}

// 更新编辑器模式
function updateEditorMode() {
    const formatType = document.getElementById('formatType').value;
    const mode = formatType === 'json' ? 'application/json' : 'yaml';
    inputEditor.setOption('mode', mode);
    outputEditor.setOption('mode', mode);
    validateInput();
}

// 验证输入
function validateInput() {
    const input = inputEditor.getValue().trim();
    if (!input) {
        hideError();
        return;
    }

    try {
        const formatType = document.getElementById('formatType').value;
        if (formatType === 'json') {
            if (!isYaml(input)) {
                JSON.parse(input);
            }
        } else {
            jsyaml.load(input);
        }
        hideError();
    } catch (error) {
        showError(error.message);
    }
}

// 显示错误信息
function showError(message) {
    const errorDiv = document.getElementById('errorMsg');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

// 隐藏错误信息
function hideError() {
    const errorDiv = document.getElementById('errorMsg');
    errorDiv.classList.add('hidden');
}

// 显示临时消息
function showTemporaryMessage(message) {
    const errorDiv = document.getElementById('errorMsg');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    errorDiv.style.color = '#48bb78'; // 成功消息使用绿色
    setTimeout(() => {
        errorDiv.classList.add('hidden');
        errorDiv.style.color = '#f56565'; // 重置回错误消息的红色
    }, 2000);
}

// 检查是否为 YAML 格式
function isYaml(str) {
    try {
        JSON.parse(str);
        return false;
    } catch (e) {
        try {
            jsyaml.load(str);
            return true;
        } catch (e) {
            return false;
        }
    }
}
