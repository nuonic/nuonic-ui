# @nuonic/ui

Shared UI components for Nuonic web apps. Ships TypeScript source — consumers transpile it.

## Installing

```json
"@nuonic/ui": "github:nuonic/nuonic-ui#v0.1.2"
```

Consumers also need:

```js
// next.config
transpilePackages: ['@nuonic/ui'],
```

```js
// tailwind.config — include the package so its classes are not purged
content: [..., './node_modules/@nuonic/ui/src/**/*.{ts,tsx}'],
```

Components use the consuming app's Tailwind theme (`primary` colour token and class-based dark mode are required).

## Components

### RagChatWidget

Floating help-chat widget. Each app provides its transport and app-specific behaviour via props:

```tsx
import RagChatWidget from '@nuonic/ui';

<RagChatWidget
  sendChat={(messages, conversationId) => postChat(messages, conversationId)}
  suggestions={['How do I create a BAS report?']}
  resolveImageUrl={(url) => `${baseUrl}${url}`} // optional
  maxHistoryMessages={12} // optional
/>;
```

## Releasing

Tag a release and point consumers at the new tag:

```sh
git tag v0.x.0 && git push origin main --tags
```
