// ft/js/app.js
import { API } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  // ===== DOM 캐시 =====
  const $url   = document.getElementById("youtubeUrl");
  const $btn   = document.getElementById("processBtn");
  const $player= document.getElementById("player");
  const $statC = document.getElementById("statusContainer");
  const $bar   = document.getElementById("progressBar");
  const $pct   = document.getElementById("progressText");
  const $msgs  = document.getElementById("statusMessages");

  /* ---------- 빠른 연결 테스트 ---------- */
  fetch(`${API}/ping`)
    .then(r => r.json())
    .then(j => console.log("✅ backend ping:", j))
    .catch(e => console.error("❌ backend ping fail", e));

  /* ---------- 버튼 ---------- */
  $btn.addEventListener("click", async () => {
    if (!$url.value.trim()) return alert("YouTube URL을 입력하세요");
    const id = extractId($url.value.trim());
    if (!id)        return alert("잘못된 URL");
    startSpinner();
    showStatus();

    /* === 실제 백엔드 호출 예시 ===
       const { subtitles } = await axios.post(`${API}/yt`, { id })
       displaySubtitles(subtitles)
    */

    // demo
    await fakePipeline(id);
  });

  /* ---------- 함수들 ---------- */
  function extractId(u){
    try{
      const url = new URL(u);
      return url.searchParams.get("v") ||
             (url.hostname==="youtu.be" ? url.pathname.slice(1) : "");
    }catch{ return ""; }
  }
  function startSpinner(){
    $btn.disabled = true;
    $btn.innerHTML = `
      <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg> Processing…`;
  }
  function endSpinner(){
    $btn.disabled=false;
    $btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z
         M9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
        clip-rule="evenodd"/>
      </svg> Process Video`;
  }
  function showStatus(){ $statC.classList.remove("hidden"); }
  function addMsg(txt,color){
    $msgs.insertAdjacentHTML("beforeend",`
      <div class="flex items-center text-sm text-${color}">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z
          M3.707 9.293a1 1 0 011.414 0L9 13.172l4.879-4.879a1 1 0 111.414 1.414l-5.586 5.586a1 1 0 01-1.414 0L3.707 10.707a1 1 0 010-1.414z"
          clip-rule="evenodd"/>
        </svg>${txt}
      </div>`);
    $msgs.scrollTop = $msgs.scrollHeight;
  }
  function setPct(p){
    $bar.style.width = `${p}%`;
    $pct.textContent = `${p}%`;
  }

  /* ---------- Demo 파이프라인 ---------- */
  async function fakePipeline(vid){
    $player.innerHTML = `
      <iframe class="w-full h-full" src="https://www.youtube.com/embed/${vid}?enablejsapi=1"
        allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
        frameborder="0" allowfullscreen></iframe>`;
    addMsg("Fetching video…","blue-400"); setPct(10);
    await delay(800);
    addMsg("Extract audio…","blue-400");  setPct(25);
    await delay(800);
    addMsg("Speech-to-text (Parakeet)…","purple-400"); setPct(55);
    await delay(1500);
    addMsg("Translate (Papago)…","purple-400"); setPct(75);
    await delay(1200);
    addMsg("Align subtitles…","blue-400"); setPct(90);
    await delay(800);
    addMsg("✅ Done!","green-400"); setPct(100);
    endSpinner();
  }
  const delay = ms => new Promise(r=>setTimeout(r,ms));
});