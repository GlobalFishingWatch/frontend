# GFW API Client Library Flow

This diagram shows the complete flow of the GFW API Client library, including authentication, token management, and request handling.

```mermaid
graph TD
    A[Client Application] --> B[GFW_API_CLASS Instance]
    B --> C{Initialization}
    C --> D[Set Configuration]
    D --> E[Initialize Storage Keys]
    E --> F[Set Status: idle]

    %% Authentication Flow
    F --> G[login Method]
    G --> H{Has Access Token?}
    H -->|Yes| I[getTokensWithAccessToken]
    H -->|No| J{Has Current Token?}

    I --> K{Token Exchange Success?}
    K -->|Yes| L[Store Tokens in localStorage]
    K -->|No| M[Token Exchange Failed]

    J -->|Yes| N[fetchUser]
    J -->|No| O{Has Refresh Token?}

    N --> P{User Fetch Success?}
    P -->|Yes| Q[Login Complete - Return User]
    P -->|No| R[Token Expired - Try Refresh]

    O -->|Yes| S[getTokenWithRefreshToken]
    O -->|No| T[Login Failed - No Tokens]

    S --> U{Refresh Success?}
    U -->|Yes| V[Update Tokens]
    U -->|No| W[Refresh Failed]

    V --> N
    R --> S

    %% Request Flow
    Q --> X[API Request]
    X --> Y[fetch Method]
    Y --> Z[generateUrl]
    Z --> AA[_internalFetch]

    AA --> BB{Wait for Login?}
    BB -->|Yes| CC[Wait for Login Promise]
    BB -->|No| DD[Prepare Headers]

    CC --> DD
    DD --> EE[Add Authorization Header]
    EE --> FF[Make HTTP Request]

    FF --> GG{Response Status}
    GG -->|Success| HH[Process Response Type]
    GG -->|401/403| II[isAuthError Check]
    GG -->|500+| JJ[Server Error]

    HH --> KK{Response Type}
    KK -->|json| LL[parseJSON]
    KK -->|blob| MM[res.blob]
    KK -->|text| NN[res.text]
    KK -->|arrayBuffer| OO[res.arrayBuffer]
    KK -->|vessel| PP[Decode PBF Data]

    LL --> QQ[Return Data]
    MM --> QQ
    NN --> QQ
    OO --> QQ
    PP --> QQ

    II --> RR{Retry Count < Max?}
    RR -->|Yes| SS[refreshAPIToken]
    RR -->|No| TT[Max Retries Exceeded]

    SS --> UU{Refresh Success?}
    UU -->|Yes| VV[Retry Request]
    UU -->|No| WW[Clear Tokens]

    VV --> AA
    WW --> XX[Throw Auth Error]
    TT --> XX
    JJ --> RR

    %% Token Management
    SS --> YY[Set Status: refreshingToken]
    YY --> ZZ[getTokenWithRefreshToken]
    ZZ --> AAA{Refresh Response}
    AAA -->|Success| BBB[Update Tokens]
    AAA -->|Failed| CCC[Set Status: idle]
    BBB --> CCC
    CCC --> DDD[Return Refresh Result]

    %% Download Flow
    QQ --> EEE[download Method]
    EEE --> FFF[Set Status: downloading]
    FFF --> GGG[_internalFetch with blob]
    GGG --> HHH[saveAs File]
    HHH --> III[Set Status: idle]
    III --> JJJ[Return Success]

    %% Logout Flow
    QQ --> KKK[logout Method]
    KKK --> LLL[Call Logout API]
    LLL --> MMM[Clear Tokens]
    MMM --> NNN[Set Status: idle]
    NNN --> OOO[Return Success]

    %% Guest User Flow
    F --> PPP[fetchGuestUser]
    PPP --> QQQ[Fetch Anonymous Permissions]
    QQQ --> RRR[Create Guest User Object]
    RRR --> SSS[Return Guest User]

    %% URL Generation
    Z --> TTT{Is Absolute URL?}
    TTT -->|Yes| UUU[Return URL As-Is]
    TTT -->|No| VVV{Has Version Prefix?}
    VVV -->|Yes| WWW[Add Base URL]
    VVV -->|No| XXX[Add Version Prefix]
    WWW --> YYY[Return Full URL]
    XXX --> YYY

    %% Storage Management
    L --> ZZZ[Token Setter]
    V --> ZZZ
    MMM --> ZZZ
    ZZZ --> AAAA{Client Side?}
    AAAA -->|Yes| BBBB[localStorage.setItem]
    AAAA -->|No| CCCC[No Storage Action]
    BBBB --> DDDD[Debug Log]
    CCCC --> DDDD

    %% Error Handling
    XX --> EEEE[parseAPIError]
    M --> EEEE
    W --> EEEE
    T --> EEEE
    EEEE --> FFFF[Return Parsed Error]

    %% Status Management
    F --> GGGG[Request Status]
    GGGG --> HHHH{Status Types}
    HHHH -->|idle| IIII[Ready for Requests]
    HHHH -->|logging| JJJJ[Login in Progress]
    HHHH -->|refreshingToken| KKKK[Token Refresh in Progress]
    HHHH -->|downloading| LLLL[File Download in Progress]

    %% Configuration
    D --> MMMM[Configuration Object]
    MMMM --> NNNN[debug: boolean]
    MMMM --> OOOO[baseUrl: string]
    MMMM --> PPPP[apiVersion: string]
    MMMM --> QQQQ[storageKeys: object]

    %% External Dependencies
    PP --> RRRR[@globalfishingwatch/pbf-decoders]
    HHH --> SSSS[file-saver]
    LL --> TTTT[parseJSON utility]
    FF --> UUUU[processStatus utility]

    %% Styling
    classDef authFlow fill:#e1f5fe
    classDef requestFlow fill:#f3e5f5
    classDef errorFlow fill:#ffebee
    classDef storageFlow fill:#e8f5e8
    classDef statusFlow fill:#fff3e0

    class G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W authFlow
    class X,Y,Z,AA,BB,CC,DD,EE,FF,GG,HH,II,JJ,KK,LL,MM,NN,OO,PP,QQ requestFlow
    class XX,EEEE,FFFF,M,W,T errorFlow
    class ZZZ,AAAA,BBBB,CCCC,DDDD storageFlow
    class GGGG,HHHH,IIII,JJJJ,KKKK,LLLL statusFlow
```

## Key Components

### Authentication Flow

- **Login Process**: Handles access tokens, refresh tokens, and user authentication
- **Token Management**: Automatic token refresh and storage in localStorage
- **Guest Users**: Support for anonymous users with limited permissions

### Request Handling

- **URL Generation**: Smart URL construction with version handling
- **Error Recovery**: Automatic retry with token refresh on auth errors
- **Response Processing**: Support for multiple response types (JSON, blob, text, etc.)

### Status Management

- **Request States**: idle, logging, refreshingToken, downloading
- **Concurrent Request Handling**: Prevents multiple login attempts

### Storage Management

- **Client-Side Storage**: Uses localStorage for token persistence
- **Server-Side Compatibility**: Graceful handling in SSR environments

### Error Handling

- **Comprehensive Error Parsing**: Converts API errors to user-friendly messages
- **Retry Logic**: Automatic retry for transient errors
- **Token Cleanup**: Removes invalid tokens on authentication failure
