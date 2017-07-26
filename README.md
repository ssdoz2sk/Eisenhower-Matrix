# 艾森豪魔術方塊

> 一個使用 Vue.js 框架做成的 艾森豪魔術方塊

## Build Setup

``` bash
# 安裝相依套件
npm install

# 開發伺服器（自動reload） localhost:8080
npm run dev

# production， 最小化 js css html
npm run build
```

## 修改 GA 追蹤
> 修改 `index.html` 的第 15 行 
> `var ga_trackingid = XXXX`

## 修改 firebase 設定
> 修改 `index.html` 的第 16 - 20 行 
> ```
    window.firebaseConfig = {
      apiKey: 'AIzaSyDUrmO0CmQhXe74I7txd8jDmwHAMszxCPA',
      authDomain: 'eisenhower-fed8a.firebaseapp.com',
      databaseURL: 'https://eisenhower-fed8a.firebaseio.com'
    }
  ```

