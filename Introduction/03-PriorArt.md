# 站在巨人肩上

Redux混合許多概念,有許多與其他技術相似的概念,但在許多重大方面仍有不同,如下所述。

## Flux

Redux受到Flux許多影響,如同Flux,Redux規定您需要將model更新邏輯集中在App裡特定的層級(Flux稱為store,React稱為Reducer)。和允許應用程式直接更改資料相比,Flux與Redux則只允許您將任何的異動描述為簡單物件,稱之為`action`。

與Flux不同之處在於,Redux不具備`Dispatcher`的概念,由於Redux透過純函式發起變更,而純函式相比之下更容易組成,我們不需要額外的實體來控管變化這些action。關鍵在於您已何種角度認知Flux,你可能將其視為一種偏差或對細節的實作。Flux時常被描述為`(state,action)=>state`,若如此,Redux可以被稱為Flux的一種框架,但藉由純函式讓一切更為簡單。

另一個與Flux的重大差異為,Redux預設認為你不會讓資料`突變`,你可以透過簡單物件或陣列回傳變更後的state,但在Reducer中直接修改state是被強烈否定的,你應該透過**物件散佈運算子或如同Immutable的函式庫**,在每次Reducer執行完畢後回傳新物件。

你仍然可以撰寫會使state異變的Reducer,但我們仍不鼓勵那麼做。你可能會說這是為了更好的效能表現,但這會使時光機、重做/回復、熱加載等功能失去作用。況且維持state的不變性看來並不會造成效能問題,就如同Om所宣稱的,既使你喪失了物件分配的優勢,你仍然會因為避免昂貴的重染與重計算而獲得更大的優勢,一切都歸功於純函式讓你得知變化確切發生在什麼時候。

由於這些價值,Flux的開發者亦認同Redux。

#Elm

Elm是一款基於函式的語言,受到Evan Czaplicki開發的Haskell啟發,Elm強迫使用"model view update"的架構,每次更新需要"(action,state)=>state"的指示。Elm的`updater`與Redux的Reducer提供著相同的功能。

與Redux不同之處在於,Elm是一門語言,他可以受益於強純粹性、靜態型別、盒外不變性以及模式配對(藉由case expression)。既使你不計劃使用Elm,你仍應該閱讀相關資訊並動手嘗試,它具有一個有趣的javascrip函式庫遊樂場具有與Redux相似的理念,我們應該在Elm中尋找新的靈感。接近靜態型別的其中一種方法是逐漸採用類似Flow的解決方案。

#Immutable

Immutable是實踐不變data的javascript函式庫,具備可用的javascript API。

Immutable與其他類似的函式庫與Redux都具有交集,你可以同時使用它們！

Redux並不在乎你如何儲存state,可以是普通物件、Immutable物件或任何其他東西。你或許希望(去)序列化的機制以開發應用程式,並將來自伺服器的資料膠合入應用程式的state,你可以使用任何資料state儲存函式庫,只要他提供不變性。例如Backbone便不適用於Redux,因為他具有異變性。

Note that, even if your immutable library supports cursors, you shouldn't use them in a Redux app. The whole state tree should be considered read-only, and you should use Redux for updating the state, and subscribing to the updates. Therefore writing via cursor doesn't make sense for Redux. If your only use case for cursors is decoupling the state tree from the UI tree and gradually refining the cursors, you should look at selectors instead. Selectors are composable getter functions. See reselect for a really great and concise implementation of composable selectors.



#Baobab
Baobab is another popular library implementing immutable API for updating plain JavaScript objects. While you can use it with Redux, there is little benefit in using them together.

Most of the functionality Baobab provides is related to updating the data with cursors, but Redux enforces that the only way to update the data is to dispatch an action. Therefore they solve the same problem differently, and don't complement each other.

Unlike Immutable, Baobab doesn't yet implement any special efficient data structures under the hood, so you don't really win anything from using it together with Redux. It's easier to just use plain objects in this case.

#RxJS
RxJS is a superb way to manage the complexity of asynchronous apps. In fact there is an effort to create a library that models human-computer interaction as interdependent observables.

Does it make sense to use Redux together with RxJS? Sure! They work great together. For example, it is easy to expose a Redux store as an observable:
```js
function toObservable(store) {
  return {
    subscribe({ next }) {
      const unsubscribe = store.subscribe(() => next(store.getState()))
      next(store.getState())
      return { unsubscribe }
    }
  }
}
```
Similarly, you can compose different asynchronous streams to turn them into actions before feeding them to store.dispatch().

The question is: do you really need Redux if you already use Rx? Maybe not. It's not hard to re-implement Redux in Rx. Some say it's a two-liner using Rx .scan() method. It may very well be!

If you're in doubt, check out the Redux source code (there isn't much going on there), as well as its ecosystem (for example, the developer tools). If you don't care too much about it and want to go with the reactive data flow all the way, you might want to explore something like Cycle instead, or even combine it with Redux. Let us know how it goes!