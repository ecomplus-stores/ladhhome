// Add your custom JavaScript for storefront pages here.

// ---------------------------------------------------------------------------
// Topo estilo Amazon: busca por voz, CEP de entrega e painel de departamentos
// ---------------------------------------------------------------------------

// busca por voz com o reconhecimento de fala do navegador (Chrome, Edge, Android)
const $mic = document.getElementById('lh-mic')
const $searchInput = document.getElementById('search-input')
const $searchForm = document.getElementById('search-form')
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
if ($mic && $searchInput && $searchForm && SpeechRecognition) {
  $mic.hidden = false
  let recognition
  $mic.addEventListener('click', () => {
    if (recognition) {
      recognition.abort()
      return
    }
    recognition = new SpeechRecognition()
    recognition.lang = 'pt-BR'
    recognition.interimResults = true
    recognition.maxAlternatives = 1
    $mic.classList.add('is-listening')
    $mic.setAttribute('aria-label', 'Ouvindo… toque para parar')
    recognition.onresult = event => {
      const result = event.results[event.results.length - 1]
      $searchInput.value = result[0].transcript.trim()
      if (result.isFinal && $searchInput.value) {
        $searchForm.submit()
      }
    }
    recognition.onend = () => {
      $mic.classList.remove('is-listening')
      $mic.setAttribute('aria-label', 'Buscar por voz')
      recognition = null
    }
    recognition.start()
  })
}

// CEP de entrega: mesma chave que a calculadora de frete do produto usa,
// então o CEP informado no topo já aparece preenchido na página do produto
const zipStorageKey = 'shipping-to-zip'
const $cepPop = document.getElementById('lh-cep-pop')
const $cepForm = document.getElementById('lh-cep-form')
const $cepInput = document.getElementById('lh-cep-input')
const formatZip = zip => zip.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2')
const readZip = () => {
  try {
    return localStorage.getItem(zipStorageKey) || ''
  } catch (e) {
    return ''
  }
}
const showZip = () => {
  const zip = readZip()
  document.querySelectorAll('[data-lh-cep-label]').forEach($label => {
    if (zip.replace(/\D/g, '').length === 8) {
      $label.textContent = `CEP ${formatZip(zip)}`
    }
  })
}
if ($cepPop && $cepForm && $cepInput) {
  showZip()
  const closePop = () => { $cepPop.hidden = true }
  document.querySelectorAll('[data-lh-cep]').forEach($btn => {
    $btn.addEventListener('click', e => {
      e.stopPropagation()
      $cepPop.hidden = !$cepPop.hidden
      if (!$cepPop.hidden) {
        $cepInput.value = formatZip(readZip())
        $cepInput.focus()
      }
    })
  })
  $cepInput.addEventListener('input', () => {
    $cepInput.value = formatZip($cepInput.value)
  })
  $cepForm.addEventListener('submit', e => {
    e.preventDefault()
    const zip = $cepInput.value.replace(/\D/g, '')
    if (zip.length !== 8) {
      $cepInput.focus()
      return
    }
    try {
      localStorage.setItem(zipStorageKey, zip)
    } catch (err) {}
    showZip()
    closePop()
  })
  $cepPop.querySelector('.lh-cep-pop__close').addEventListener('click', closePop)
  $cepPop.addEventListener('click', e => e.stopPropagation())
  document.addEventListener('click', closePop)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePop()
  })
}

// painel de departamentos: passar o mouse num departamento mostra as subcategorias dele
const $deptPanel = document.getElementById('s-all')
if ($deptPanel) {
  const activate = slug => {
    $deptPanel.querySelectorAll('[data-lh-dept]').forEach($item => {
      $item.classList.toggle('is-active', $item.dataset.lhDept === slug)
    })
    $deptPanel.querySelectorAll('[data-lh-panel]').forEach($panel => {
      $panel.classList.toggle('is-active', $panel.dataset.lhPanel === slug)
    })
  }
  $deptPanel.querySelectorAll('[data-lh-dept]').forEach($item => {
    $item.addEventListener('mouseenter', () => activate($item.dataset.lhDept))
    $item.addEventListener('focus', () => activate($item.dataset.lhDept))
  })
}

// ---------------------------------------------------------------------------
// Faixa de vantagens: entrega no mesmo dia com contagem regressiva
// (mesma regra da página do produto: dia útil até 12h55 chega hoje)
// ---------------------------------------------------------------------------

const $delivery = document.querySelector('[data-lh-delivery]')
if ($delivery) {
  const $title = $delivery.querySelector('[data-lh-delivery-title]')
  const $text = $delivery.querySelector('[data-lh-delivery-text]')
  const names = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
  const update = () => {
    const now = new Date()
    const day = now.getDay()
    const cutoff = new Date(now)
    cutoff.setHours(12, 55, 0, 0)
    if (day >= 1 && day <= 5 && now < cutoff) {
      const min = Math.max(0, Math.floor((cutoff - now) / 60000))
      $title.textContent = 'Receba hoje em São Paulo'
      $text.innerHTML = `Peça até 12h55 · faltam <em>${Math.floor(min / 60)}h ${min % 60}min</em>`
      return
    }
    const target = new Date(cutoff)
    target.setDate(target.getDate() + (day === 6 ? 2 : 1))
    $title.textContent = day === 6 || day === 5
      ? `Receba ${names[target.getDay()]} em São Paulo`
      : 'Receba amanhã em São Paulo'
    $text.textContent = 'Peça agora e consulte as regiões atendidas'
  }
  update()
  setInterval(update, 30000)
}

// rodapé: no celular as colunas de links começam fechadas (sanfona)
if (window.matchMedia('(max-width: 767.98px)').matches) {
  document.querySelectorAll('.lh-foot__col').forEach($col => {
    $col.open = false
  })
}

// ---------------------------------------------------------------------------
// Topo compacto: ao rolar a página o menu de departamentos recolhe e fica só a
// barra principal; volta quando a página chega perto do topo (folga evita piscar)
// ---------------------------------------------------------------------------

const $lhHeader = document.getElementById('header')
if ($lhHeader && $lhHeader.classList.contains('lh-header')) {
  let isCompact = false
  const updateHeader = () => {
    const y = window.scrollY || window.pageYOffset
    if (!isCompact && y > 160) {
      isCompact = true
    } else if (isCompact && y < 60) {
      isCompact = false
    } else {
      return
    }
    $lhHeader.classList.toggle('is-compact', isCompact)
  }
  window.addEventListener('scroll', updateHeader, { passive: true })
  updateHeader()
}

// ---------------------------------------------------------------------------
// Busca: placeholder "digitando" palavras-chave dos produtos mais procurados
// ---------------------------------------------------------------------------

const $lhSearch = document.getElementById('search-input')
if ($lhSearch) {
  const words = [
    'cadeado Tetra 32mm',
    'resistência Lorenzetti',
    'potes herméticos de vidro',
    'decanter de vinho',
    'tapete para air fryer',
    'jarra de vidro',
    'jogo de taças',
    'caixa de som bluetooth',
    'alicate universal',
    'flanela de microfibra'
  ]
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    $lhSearch.placeholder = words.slice(0, 3).join(', ') + '…'
  } else {
    let word = 0
    let chars = 0
    let deleting = false
    const tick = () => {
      // pausa enquanto a pessoa usa o campo ou a aba está escondida
      if (document.activeElement === $lhSearch || $lhSearch.value || document.hidden) {
        $lhSearch.placeholder = ''
        setTimeout(tick, 600)
        return
      }
      const text = words[word]
      chars += deleting ? -1 : 1
      $lhSearch.placeholder = text.slice(0, chars) + (deleting ? '' : '|')
      let delay = deleting ? 35 : 75
      if (!deleting && chars >= text.length) {
        $lhSearch.placeholder = text
        deleting = true
        delay = 1700
      } else if (deleting && chars <= 0) {
        deleting = false
        word = (word + 1) % words.length
        delay = 350
      }
      setTimeout(tick, delay)
    }
    tick()
  }
}
