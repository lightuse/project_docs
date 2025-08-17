# 開発環境セットアップ

このガイドでは、プロジェクトの開発環境をセットアップする方法を説明します。

## 必要な環境

### システム要件
- **Node.js**: 18.0 以上
- **Python**: 3.9 以上  
- **Git**: 2.0 以上

### 推奨エディター
- **VS Code** (推奨)
- **PyCharm**
- **WebStorm**

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/username/project_docs.git
cd project_docs
```

### 2. Python環境のセットアップ

```bash
# Python仮想環境の作成
python -m venv venv

# 仮想環境の有効化 (Windows)
venv\Scripts\activate

# 仮想環境の有効化 (macOS/Linux)  
source venv/bin/activate

# 依存関係のインストール
pip install -r requirements.txt
```

### 3. Node.js依存関係のインストール

```bash
npm install
```

### 4. 開発サーバーの起動

```bash
# MKDocsサーバーの起動
mkdocs serve

# または、TypeDocを含む開発モード
npm run dev
```

## ディレクトリ構成の理解

```
project_docs/
├── docs/                   # MKDocsドキュメント
│   ├── index.md           # トップページ
│   ├── api/               # API文書  
│   ├── guides/            # ガイド文書
│   └── tutorials/         # チュートリアル
├── src/                   # サンプルソースコード
│   ├── typescript/        # TypeScriptファイル
│   └── python/           # Pythonファイル
├── scripts/              # ビルドスクリプト
├── mkdocs.yml           # MKDocs設定
├── requirements.txt     # Python依存関係
└── package.json        # Node.js依存関係
```

## 開発ワークフロー

### ドキュメント編集

1. **Markdownファイルの編集**
   ```bash
   # docs/フォルダ内のファイルを編集
   code docs/guides/new-guide.md
   ```

2. **変更の確認**
   ```bash
   # ローカルサーバーで確認
   mkdocs serve
   # http://localhost:8000 でアクセス
   ```

### API文書の更新

1. **TypeScript文書の更新**
   ```bash
   # TypeScript文書を再生成
   npm run typedoc
   ```

2. **Python文書の更新**
   ```bash
   # Python文書を再生成
   python scripts/build-sphinx.py
   ```

### 図表の作成

```mermaid
graph LR
    A[Mermaid記法] --> B[図表生成]
    B --> C[MKDocs統合]
    C --> D[表示]
```

## トラブルシューティング

### よくある問題

#### 1. MKDocsビルドエラー

```bash
# 設定ファイルの確認
mkdocs config

# 依存関係の再インストール
pip install -r requirements.txt --force-reinstall
```

#### 2. TypeDocエラー

```bash
# TypeScript設定の確認
npx tsc --noEmit

# 依存関係の確認
npm install --save-dev @types/node
```

#### 3. Pythonモジュールエラー

```bash
# Python環境の確認
python --version
pip list

# 仮想環境の再作成
deactivate
rm -rf venv
python -m venv venv
```

## エディター設定

### VS Code推奨拡張機能

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-vscode.vscode-typescript-next", 
    "yzhang.markdown-all-in-one",
    "bierner.markdown-mermaid",
    "davidanson.vscode-markdownlint"
  ]
}
```

### VS Codeワークスペース設定

```json
{
  "python.defaultInterpreterPath": "./venv/bin/python",
  "python.terminal.activateEnvironment": true,
  "markdown.extension.toc.levels": "2..6",
  "files.associations": {
    "*.md": "markdown"
  }
}
```

## 品質チェック

### リンテイング

```bash
# Markdownリンター
markdownlint docs/

# Python コード品質チェック  
flake8 src/python/
black src/python/

# TypeScript リンター
npm run lint
```

### ビルドテスト

```bash
# 完全ビルドテスト
npm run docs:build

# デプロイテスト (GitHub Pages)
mkdocs gh-deploy --clean --dry-run
```

## 次のステップ

環境セットアップが完了したら：

1. 実際にドキュメントを作成してみる
2. MKDocsのライブリロードで変更を確認
3. GitHub Pagesでの公開を試す

## サポート

問題が発生した場合：

- [GitHub Issues](https://github.com/username/project_docs/issues)
- [プロジェクトREADME](../../README.md)を参照
