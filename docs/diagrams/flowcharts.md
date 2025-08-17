# フローチャートと図表

システムの構造とフローを視覚的に表現するための各種図表です。

## システムアーキテクチャ

```mermaid
graph TB
    subgraph "フロントエンド"
        UI[ユーザーインターフェース]
        Router[ルーター]
        Store[状態管理]
    end
    
    subgraph "API Gateway"
        Gateway[ゲートウェイ]
        Auth[認証ミドルウェア]
        RateLimit[レート制限]
    end
    
    subgraph "マイクロサービス"
        UserService[ユーザーサービス]
        DataService[データサービス]
        NotificationService[通知サービス]
    end
    
    subgraph "データ層"
        PostgreSQL[(PostgreSQL)]
        Redis[(Redis)]
        S3[(S3)]
    end
    
    UI --> Router
    Router --> Store
    Store --> Gateway
    Gateway --> Auth
    Auth --> RateLimit
    RateLimit --> UserService
    RateLimit --> DataService
    RateLimit --> NotificationService
    
    UserService --> PostgreSQL
    DataService --> PostgreSQL
    DataService --> S3
    NotificationService --> Redis
    
    style UI fill:#e1f5fe
    style Gateway fill:#fff3e0
    style PostgreSQL fill:#e8f5e8
```

## データフロー図

```mermaid
flowchart LR
    A[データソース] --> B{データ検証}
    B -->|有効| C[データ変換]
    B -->|無効| D[エラーログ]
    C --> E[データ保存]
    E --> F[インデックス更新]
    F --> G[キャッシュ更新]
    G --> H[通知送信]
    
    D --> I[アラート]
    I --> J[管理者通知]
    
    style A fill:#e3f2fd
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style E fill:#e8f5e8
    style D fill:#ffebee
```

## デプロイメントフロー

```mermaid
flowchart TD
    A[開発者] --> B[コードプッシュ]
    B --> C{CI/CD パイプライン}
    
    C --> D[テスト実行]
    D --> E{テスト結果}
    E -->|成功| F[ビルド]
    E -->|失敗| G[通知&停止]
    
    F --> H[セキュリティスキャン]
    H --> I{脆弱性チェック}
    I -->|問題なし| J[ステージング環境]
    I -->|問題あり| K[セキュリティ通知]
    
    J --> L[統合テスト]
    L --> M{品質ゲート}
    M -->|合格| N[本番環境デプロイ]
    M -->|不合格| O[ロールバック]
    
    N --> P[ヘルスチェック]
    P --> Q[モニタリング開始]
    
    style C fill:#e1f5fe
    style E fill:#fff3e0
    style I fill:#fff3e0
    style M fill:#fff3e0
    style N fill:#e8f5e8
    style G fill:#ffebee
    style K fill:#ffebee
    style O fill:#ffebee
```

## ユーザー認証フロー

```mermaid
flowchart TD
    A[ユーザー] --> B[ログイン画面]
    B --> C[認証情報入力]
    C --> D{認証サーバー}
    
    D -->|成功| E[JWTトークン発行]
    D -->|失敗| F[エラーメッセージ]
    
    E --> G[セッション確立]
    G --> H[アプリケーションアクセス]
    
    F --> I[再試行]
    I --> C
    
    F --> J{試行回数}
    J -->|上限| K[アカウントロック]
    J -->|未満| I
    
    H --> L[トークン有効性確認]
    L -->|有効| M[リクエスト処理]
    L -->|無効| N[再認証要求]
    
    style D fill:#e1f5fe
    style E fill:#e8f5e8
    style F fill:#ffebee
    style K fill:#ffebee
```

## エラーハンドリングフロー

```mermaid
flowchart LR
    A[リクエスト] --> B{エラー発生?}
    B -->|なし| C[正常処理]
    B -->|あり| D[エラー分類]
    
    D --> E{エラータイプ}
    E -->|クライアント| F[4xx エラー]
    E -->|サーバー| G[5xx エラー]
    E -->|ネットワーク| H[接続エラー]
    
    F --> I[ユーザー向けメッセージ]
    G --> J[ログ出力]
    G --> K[アラート送信]
    H --> L[リトライ機構]
    
    J --> M[エラー分析]
    K --> N[運用チーム通知]
    L --> O{リトライ回数}
    O -->|上限内| A
    O -->|上限| P[エラー応答]
    
    style B fill:#fff3e0
    style E fill:#fff3e0
    style F fill:#ffecb3
    style G fill:#ffebee
    style H fill:#fce4ec
```

## データベース設計

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER ||--o{ REVIEW : writes
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : ordered_in
    PRODUCT ||--o{ REVIEW : has
    CATEGORY ||--o{ PRODUCT : contains
    
    USER {
        int id PK
        string email UK
        string name
        datetime created_at
        datetime updated_at
    }
    
    PRODUCT {
        int id PK
        string name
        decimal price
        text description
        int category_id FK
        datetime created_at
    }
    
    ORDER {
        int id PK
        int user_id FK
        decimal total
        string status
        datetime created_at
    }
    
    ORDER_ITEM {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal price
    }
    
    CATEGORY {
        int id PK
        string name
        string slug UK
    }
    
    REVIEW {
        int id PK
        int user_id FK
        int product_id FK
        int rating
        text comment
        datetime created_at
    }
```

## モニタリングダッシュボード構成

```mermaid
graph TB
    subgraph "データ収集"
        A[アプリケーションメトリクス]
        B[インフラメトリクス]
        C[ログデータ]
        D[ユーザーイベント]
    end
    
    subgraph "処理・分析"
        E[Prometheus]
        F[Elasticsearch]
        G[InfluxDB]
    end
    
    subgraph "可視化"
        H[Grafana]
        I[Kibana]
        J[カスタムダッシュボード]
    end
    
    subgraph "アラート"
        K[Alertmanager]
        L[PagerDuty]
        M[Slack通知]
    end
    
    A --> E
    B --> E
    C --> F
    D --> G
    
    E --> H
    F --> I
    G --> J
    
    E --> K
    K --> L
    K --> M
    
    style E fill:#e3f2fd
    style F fill:#e8f5e8
    style G fill:#fff3e0
    style K fill:#ffebee
```

## API設計パターン

```mermaid
classDiagram
    class APIGateway {
        +route(request)
        +authenticate(token)
        +rateLimit(client)
        +logRequest(request)
    }
    
    class ServiceA {
        +processRequest(data)
        +validateInput(data)
        +businessLogic()
        +returnResponse()
    }
    
    class ServiceB {
        +handleEvent(event)
        +processData(data)
        +notifyService(service)
    }
    
    class Database {
        +query(sql)
        +transaction()
        +connection()
    }
    
    class Cache {
        +get(key)
        +set(key, value)
        +delete(key)
        +expire(key, ttl)
    }
    
    APIGateway --> ServiceA : routes to
    APIGateway --> ServiceB : routes to
    ServiceA --> Database : queries
    ServiceA --> Cache : caches
    ServiceB --> Database : updates
    ServiceB --> Cache : invalidates
```

!!! tip "図表の活用"
    これらの図表は以下の用途で活用できます：
    
    - **システム理解**: 全体像の把握
    - **設計レビュー**: アーキテクチャの検証
    - **ドキュメント**: 技術仕様書への組み込み
    - **教育**: 新メンバーへの説明資料

!!! note "図表の更新"
    システムの変更に合わせて図表も更新することで、
    常に最新の状態を保つことができます。
