# 動機

隨著JavaScript的SPA(Single Page Application)迅速發展,需要管理的`state`複雜度也超過以往需求,例如server回應的資料,cache資料,用戶端尚未傳輸至server的資料,UI複雜度亦然。

管理不斷變化的state是困難的,例如一個view可以改變model,而這個model可以改變另一個model,進而改變另一個view。有時候你會感到一切失控了,並不能理解發生了什麼，尤其是在不透明且非確定的系統中，最終導致難以除錯以及增添新功能。

更糟糕的是：前端的變更需求變的頻繁,前端工作者須要控制UI更新,伺服器端的渲染,在路由變化前取得資料等等,我們需要面對前所未見的困難挑戰,使我們不禁會問：`該放棄了嗎？`,答案是`不`。

以上種種困難根源於混合了兩種概念：`不變`與`非同步`。就如同曼陀珠與可樂,分則相安,合則爆炸,框架如`React`試圖在view層透過移除非同步與直接對DOM的操作解決此一問題,然而,管理state的責任依然在你身上,這就是`Redux`出現的原因。

接著閱讀[Flux](http://facebook.github.io/flux/),[CQRS](https://martinfowler.com/bliki/CQRS.html),[Event Sourcing
](https://martinfowler.com/eaaDev/EventSourcing.html),了解Redux如何藉由一些限制達到不變的state以及更新state應該在何時發生,這些限制反映在Redux的三大基本原則。