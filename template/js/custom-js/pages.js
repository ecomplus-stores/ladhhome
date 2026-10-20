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
