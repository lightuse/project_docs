# GitHub Pagesセットアップガイド

MKDocsサイトをGitHub Pagesで公開するための手順です。

## 🚀 GitHub Pages設定

### 1. リポジトリ設定

1. GitHubリポジトリに移動
2. **Settings** タブをクリック
3. 左サイドバーの **Pages** をクリック

### 2. ソース設定

1. **Source** セクションで **"GitHub Actions"** を選択
2. この設定により、GitHub Actionsワークフローからのデプロイメントが有効になります

![GitHub Pages設定](https://docs.github.com/assets/cb-49777/mw-1440/images/help/pages/select-github-actions-as-source.webp)

### 3. デプロイメント

設定完了後：

1. `main`ブランチにコードをプッシュ
2. GitHub Actionsが自動実行
3. サイトが `https://username.github.io/project_docs` で公開

## 🔧 トラブルシューティング

### よくある問題

#### 1. "Not Found" エラー
```
Error: HttpError: Not Found
```

**解決方法:**
- GitHub Pagesが有効になっているか確認
- Source設定が "GitHub Actions" になっているか確認

#### 2. ワークフローの権限エラー

**解決方法:**
1. Repository Settings > Actions > General
2. "Workflow permissions" で以下を確認：
   - **Read and write permissions** を選択
   - **Allow GitHub Actions to create and approve pull requests** をチェック

#### 3. 環境保護ルールエラー
```
Branch "develop" is not allowed to deploy to github-pages due to environment protection rules.
```

**解決方法:**
1. Repository Settings > Environments > github-pages
2. "Deployment branches" を確認
3. 許可されたブランチに `develop` が含まれているか確認
4. または、ワークフローが正しい `develop` ブランチから実行されているか確認

## 環境保護設定

GitHub Pagesの環境保護ルールを適切に設定します：

### 環境設定の確認

1. **Repository Settings** > **Environments** に移動
2. **github-pages** 環境をクリック
3. **Deployment branches** セクションを確認

### 推奨設定

```yaml
# 推奨: Protected branches only
Deployment branches: Protected branches only

# または: Selected branches
Selected branches: 
  - develop
```

### 設定変更手順

1. **Add deployment branch rule** をクリック
2. ブランチパターンを入力:
   - `develop` (メインブランチ)
   - `refs/heads/develop` (完全パス)
3. **Add rule** で保存

## �📊 デプロイメント状況確認

### GitHub Actions

1. リポジトリの **Actions** タブを確認
2. デプロイメントの状況とログを確認
3. エラーがある場合は詳細ログを確認

### サイト確認

デプロイ完了後：
- `https://username.github.io/project_docs` でアクセス
- 変更が反映されるまで数分かかる場合があります

## 🔄 再デプロイ

### 自動デプロイ
- `develop`ブランチへのプッシュで自動実行

### 手動デプロイ
1. GitHub Actions タブ
2. "Deploy MKDocs to GitHub Pages" ワークフロー選択  
3. **Run workflow** ボタンをクリック

## 📝 設定ファイル

`.github/workflows/deploy.yml` の主要設定：

```yaml
permissions:
  contents: read
  pages: write
  id-token: write

on:
  push:
    branches: [develop]
  workflow_dispatch: # 手動実行
```

## 🌐 URL設定

サイトURLを設定するには `mkdocs.yml` を更新：

```yaml
site_url: https://username.github.io/project_docs
repo_url: https://github.com/username/project_docs
```

## 💡 ベストプラクティス

1. **ブランチ保護**: `develop`ブランチの保護ルール設定
2. **プレビュー**: プルリクエストでのプレビュー機能

---

