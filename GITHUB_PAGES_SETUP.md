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

#### 3. カスタムドメイン

カスタムドメインを使用する場合：

1. Repository Settings > Pages
2. "Custom domain" に独自ドメインを入力
3. DNSでCNAMEレコードを設定：
   ```
   www.yourdomain.com → username.github.io
   ```

## 📊 デプロイメント状況確認

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
- `main`ブランチへのプッシュで自動実行

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
    branches: [main]
  workflow_dispatch: # 手動実行
```

## 🌐 URL設定

サイトURLを設定するには `mkdocs.yml` を更新：

```yaml
site_url: https://username.github.io/project_docs
repo_url: https://github.com/username/project_docs
```

## 💡 ベストプラクティス

1. **ブランチ保護**: `main`ブランチの保護ルール設定
2. **プレビュー**: プルリクエストでのプレビュー機能
3. **バージョニング**: `mike` によるバージョン管理
4. **監視**: デプロイメントのアラート設定

---

