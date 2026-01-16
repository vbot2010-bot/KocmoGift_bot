document.addEventListener("DOMContentLoaded", () => {

  // Telegram Mini App
  const tg = window.Telegram.WebApp;
  tg.expand();

  const user = tg.initDataUnsafe.user || {};
  document.getElementById("username").innerText = user.username || user.first_name || "—";
  document.getElementById("user-id").innerText = user.id || "—";

  // Баланс
  let balance = 10;
  const balanceEl = document.getElementById("balance");
  balanceEl.innerText = balance;

  // Инвентарь
  const inventory = document.getElementById("inventory");

  // Навигация
  const pages = { home: "home", profile: "profile" };
  const showPage = (pageId) => {
    Object.values(pages).forEach(p => document.getElementById(p).classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
  };

  document.getElementById("btn-home").addEventListener("click", () => showPage(pages.home));
  document.getElementById("btn-profile").addEventListener("click", () => showPage(pages.profile));

  // TonConnect
  const OWNER_WALLET = "UQAFXBXzBzau6ZCWzruiVrlTg3HAc8MF6gKIntqTLDifuWOi";
  const walletStatus = document.getElementById("wallet-status");
  const connectBtn = document.getElementById("connect-wallet");
  const depositBtn = document.getElementById("deposit");

  const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://kocmo-gift-exg8x4ap8-kocmogift.vercel.app/tonconnect-manifest.json"
  });

  function updateWalletUI(wallet) {
    if(wallet) {
      walletStatus.innerText = "✅ Кошелёк подключён";
      connectBtn.innerText = "🔌 Отключить кошелёк";
    } else {
      walletStatus.innerText = "❌ Кошелёк не подключён";
      connectBtn.innerText = "🔗 Подключить кошелёк";
    }
  }

  tonConnectUI.onStatusChange(wallet => updateWalletUI(wallet));
  updateWalletUI(tonConnectUI.wallet);

  connectBtn.addEventListener("click", async () => {
    if(tonConnectUI.wallet) {
      await tonConnectUI.disconnect();
      updateWalletUI(null);
    } else {
      await tonConnectUI.connectWallet();
    }
  });

  depositBtn.addEventListener("click", async () => {
    if(!tonConnectUI.wallet) { alert("Сначала подключи кошелек"); return; }
    const amountTON = 1;
    const amountNano = amountTON * 1e9;
    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [{ address: OWNER_WALLET, amount: amountNano.toString() }]
      });
      balance += amountTON;
      balanceEl.innerText = balance;
      alert("Баланс пополнен!");
    } catch {
      alert("Платеж отменён");
    }
  });

  // Открытие кейсов
  document.getElementById("open-case").addEventListener("click", () => {
    if(balance < 1) { alert("Недостаточно TON"); return; }
    balance -= 1;
    balanceEl.innerText = balance;

    const rewards = ["🎁 Gift", "💎 Diamond", "⚡ Energy"];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    inventory.innerHTML += `<div>${reward}</div>`;
  });

});
