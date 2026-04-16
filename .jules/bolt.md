## 2024-04-16 - DoL UI React Optimizations
**Learning:** React.memo() wasn't applied to complex, expensive UI components like `DoLCharacterSprite` and `DoLStatsSidebar` despite them depending only on global state props (`state`) which allows for easier memoization.
**Action:** When finding complex SVGs or UI heavy representations that rely purely on state and props (such as paper-doll vector systems), ensure `React.memo` is used to block re-renders from parent changes unless their inputs have explicitly mutated.
