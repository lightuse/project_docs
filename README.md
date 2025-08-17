# MKDocs Documentation Project

GitHub Pages上でホスティングされる包括的なドキュメントサイト。TypeDoc、Sphinx、Mermaidを統合した現代的なドキュメンテーションシステム。

[![Deploy MKDocs](https://github.com/lightuse/project_docs/actions/workflows/deploy.yml/badge.svg)](https://github.com/lightuse/project_docs/actions/workflows/deploy.yml)
[![Documentation](https://img.shields.io/badge/docs-mkdocs-blue.svg)](https://lightuse.github.io/project_docs)

## 🚀 特徴

- **📚 統合ドキュメント**: MKDocs + Material Design
- **🔧 API文書自動生成**: TypeDoc (TypeScript) + Sphinx (Python)  
- **📊 インタラクティブ図表**: Mermaidシーケンス図・フローチャート
- **⚡ 自動デプロイ**: GitHub Actions + GitHub Pages
- **🔍 全文検索**: 高速検索機能
- **🌐 レスポンシブ**: モバイル対応UI

## 📋 目次

- [クイックスタート](#クイックスタート)
- [プロジェクト構成](#プロジェクト構成)
- [開発環境セットアップ](#開発環境セットアップ)
- [使用方法](#使用方法)
- [デプロイメント](#デプロイメント)
- [カスタマイズ](#カスタマイズ)

## ⚡ クイックスタート

### 必要な環境

- Node.js 18+
- Python 3.9+
- Git 2.0+

### セットアップ

```bash
# 1. リポジトリのクローン
git clone https://github.com/lightuse/project_docs.git
cd project_docs

# 2. Python依存関係のインストール
pip install -r requirements.txt

# 3. Node.js依存関係のインストール
npm install

# 4. サンプルファイルの生成とドキュメントビルド
npm run docs:build

# 5. ローカルサーバーの起動
mkdocs serve
```

ブラウザで http://localhost:8000 にアクセスして確認してください。

## 📁 プロジェクト構成

```
project_docs/
├── 📄 DESIGN.md              # 設計方針ドキュメント
├── 📄 mkdocs.yml            # MKDocs設定ファイル
├── 📄 requirements.txt      # Python依存関係
├── 📄 package.json         # Node.js依存関係
├── 📄 tsconfig.json        # TypeScript設定
├── 📁 docs/                # ドキュメントソース
│   ├── 📄 index.md         # トップページ
│   ├── 📁 api/             # API文書
│   │   ├── 📁 typescript/  # TypeDoc生成文書
│   │   └── 📁 python/      # Sphinx生成文書
│   ├── 📁 architecture/    # アーキテクチャ文書
│   ├── 📁 diagrams/        # 図表集
│   ├── 📁 guides/          # 開発ガイド
│   └── 📁 tutorials/       # チュートリアル
├── 📁 src/                 # サンプルソースコード
│   ├── 📁 typescript/      # TypeScriptサンプル
│   └── 📁 python/         # Pythonサンプル
├── 📁 scripts/             # ビルドスクリプト
│   ├── 📄 build-typedoc.js # TypeDoc生成
│   └── 📄 build-sphinx.py  # Sphinx生成
└── 📁 .github/
    └── 📁 workflows/
        └── 📄 deploy.yml    # GitHub Actions CI/CD
```

## 🛠️ 開発環境セットアップ

### Python仮想環境

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate

# 依存関係インストール
pip install -r requirements.txt
```

### 開発サーバー

```bash
# MKDocsサーバーのみ
mkdocs serve

# TypeDoc監視付き開発モード
npm run dev
```

## 📖 使用方法

### ドキュメント作成

1. **Markdownファイル作成**
   ```bash
   # 新しいガイドを作成
   touch docs/guides/new-guide.md
   ```

2. **ナビゲーション更新**
   ```yaml
   # mkdocs.yml
   nav:
     - Guides:
       - New Guide: guides/new-guide.md
   ```

### API文書生成

#### TypeScript文書

```bash
# TypeScript API文書を生成
npm run typedoc

# または、ウォッチモードで開発
npm run typedoc:watch
```

#### Python文書

```bash
# Python API文書を生成  
npm run sphinx:build

# または、直接実行
python scripts/build-sphinx.py
```

### 図表の作成

Mermaid記法を使用して図表を作成：

```markdown
## システムフロー

\`\`\`mermaid
graph LR
    A[ユーザー] --> B[API]
    B --> C[データベース]
    C --> D[レスポンス]
    D --> A
\`\`\`
```

## 🚀 デプロイメント

### 自動デプロイ (推奨)

GitHub Actionsによる自動デプロイが設定されています：

1. `main`ブランチにプッシュ
2. 自動的にビルドとデプロイが実行
3. GitHub Pagesで公開

### 手動デプロイ

```bash
# 手動でGitHub Pagesにデプロイ
mkdocs gh-deploy

# クリーンビルドでデプロイ
mkdocs gh-deploy --clean
```

## ⚙️ カスタマイズ

### テーマ設定

`mkdocs.yml`でMaterial for MKDocsテーマをカスタマイズ：

```yaml
theme:
  name: material
  palette:
    primary: blue
    accent: blue
  features:
    - navigation.tabs
    - search.suggest
```

### プラグイン追加

```yaml
plugins:
  - search
  - mermaid2
  - git-revision-date-localized
```

### カスタムCSS

```yaml
extra_css:
  - stylesheets/extra.css
```

## 📊 技術スタック

| 技術 | バージョン | 用途 |
|------|------------|------|
| [MKDocs](https://mkdocs.org) | 1.5+ | 静的サイトジェネレーター |
| [Material for MKDocs](https://squidfunk.github.io/mkdocs-material/) | 9.0+ | テーマ・UI |
| [TypeDoc](https://typedoc.org) | 0.25+ | TypeScript API文書 |
| [Sphinx](https://sphinx-doc.org) | 7.0+ | Python API文書 |
| [Mermaid](https://mermaid.js.org) | 10.0+ | 図表生成 |
| [GitHub Actions](https://github.com/features/actions) | - | CI/CD |
| [GitHub Pages](https://pages.github.com) | - | ホスティング |

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### 開発ガイドライン

- コードスタイルに従う
- ドキュメントを更新する
- テストを通す
- コミットメッセージは明確に

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。


## 🙏 謝辞

- [MKDocs](https://mkdocs.org)チーム
- [Material for MKDocs](https://squidfunk.github.io/mkdocs-material/)