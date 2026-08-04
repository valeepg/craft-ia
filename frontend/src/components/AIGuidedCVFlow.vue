<template>
  <div class="ai-guided-cv-flow relative min-h-screen bg-[#030712] text-white font-sans overflow-hidden selection:bg-indigo-500 selection:text-white">
  
    <!-- Fondos dinámicos elegantes (Misma paleta que el Landing Page) -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div class="absolute inset-0 bg-[#030712]"></div>
      
      <!-- Orbe brillante violeta/índigo superior -->
      <div class="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/25 via-purple-600/15 to-transparent blur-[120px] animate-pulse"></div>
      
      <!-- Orbe brillante cian inferior -->
      <div class="absolute top-[40%] -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-l from-cyan-500/15 via-blue-600/10 to-transparent blur-[140px]"></div>

      <!-- Malla sutil -->
      <div class="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
    </div>

    <div class="mx-auto flex min-h-screen max-w-[1280px] w-[90%] flex-col relative z-10">
      <!-- Navbar Unificado -->
      <Navbar @openLogin="authStore.showLoginModal = true" />


      <!-- Content -->
      <main class="flex-1 overflow-auto px-2 sm:px-4 pb-24 pt-20">
        <div class="mx-auto w-full max-w-[1280px]">
          <!-- Step indicators -->
          <div class="mb-8 flex flex-wrap items-center justify-center gap-3">
            <template v-for="step in 5" :key="step">
              <button
                type="button"
                class="flex items-center gap-2.5 rounded-2xl border px-4 py-2 text-xs font-bold transition-all duration-300"
                :class="{
                  'border-indigo-500/60 bg-gradient-to-r from-indigo-600/30 to-cyan-600/20 text-indigo-200 shadow-[0_0_20px_rgba(99,102,241,0.3)] scale-105': currentStep === step,
                  'border-white/10 bg-slate-900/40 text-slate-400 hover:bg-slate-900/70 hover:text-white': currentStep !== step,
                }"
                @click="currentStep = step"
              >
                <span class="flex h-5 w-5 items-center justify-center rounded-lg text-[11px] font-black"
                  :class="currentStep === step ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-400'">
                  {{ step }}
                </span>
                <span class="hidden sm:inline">Paso {{ step }}</span>
              </button>
            </template>
          </div>

          <!-- Card container -->
          <div class="rounded-3xl border border-white/15 bg-slate-900/60 p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl">            <!-- Paso 1 (Con Guías Concisas de Usuario) -->
            <div v-if="currentStep === 1" class="space-y-6 animate-fade-in text-left">
              <div class="space-y-1 text-left">
                <span class="text-indigo-400 text-xs font-bold uppercase tracking-widest block">Estrategia Inicial</span>
                <h2 class="text-2xl font-extrabold text-white tracking-tight">Paso 1: Define tu Meta Profesional</h2>
                <p class="text-xs text-slate-400 font-light mt-0.5">Define tu objetivo, indica el puesto deseado e ingresa los detalles de la oferta para que la IA adapte tus fortalezas.</p>
              </div>

              <!-- Selector de Modo de Inicio -->
              <!-- Para usuarios sin cuenta: ambas opciones en la misma fila, pero la segunda bloqueada -->
              <div v-if="!authStore.user" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  class="flex items-center gap-3 p-4 rounded-2xl border border-indigo-500 bg-indigo-600/20 shadow-[0_0_20px_rgba(99,102,241,0.25)] text-left"
                >
                  <span class="text-2xl">✏️</span>
                  <div>
                    <p class="text-xs font-bold text-white">Crear CV desde Cero</p>
                    <p class="text-[10px] text-slate-400 font-light mt-0.5">Rellena el formulario guiado con ayuda de la IA.</p>
                  </div>
                </button>

                <button
                  type="button"
                  @click="authStore.showLoginModal = true"
                  class="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-slate-950/40 hover:bg-slate-900/60 transition-all text-left group"
                >
                  <span class="text-2xl group-hover:scale-110 transition-transform">🔒</span>
                  <div>
                    <p class="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">Importar CV (Requiere cuenta)</p>
                    <p class="text-[10px] text-slate-500 font-light mt-0.5 group-hover:text-slate-400 transition-colors">Inicia sesión o regístrate gratis para desbloquear.</p>
                  </div>
                </button>
              </div>

              <!-- Para usuarios autenticados: ambas opciones activas -->
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="startMode = 'scratch'"
                  :class="[
                    'flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer',
                    startMode === 'scratch'
                      ? 'border-indigo-500 bg-indigo-600/20 shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                      : 'border-white/10 bg-slate-950/40 hover:border-indigo-500/40 hover:bg-slate-900/60'
                  ]"
                >
                  <span class="text-2xl">✏️</span>
                  <div>
                    <p class="text-xs font-bold text-white">Crear CV desde Cero</p>
                    <p class="text-[10px] text-slate-400 font-light mt-0.5">Rellena el formulario guiado con ayuda de la IA.</p>
                  </div>
                </button>

                <button
                  type="button"
                  @click="startMode = 'import'"
                  :class="[
                    'flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer',
                    startMode === 'import'
                      ? 'border-cyan-500 bg-cyan-600/15 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'border-white/10 bg-slate-950/40 hover:border-cyan-500/40 hover:bg-slate-900/60'
                  ]"
                >
                  <span class="text-2xl">📄</span>
                  <div>
                    <p class="text-xs font-bold text-white">Importar mi CV Actual</p>
                    <p class="text-[10px] text-slate-400 font-light mt-0.5">Sube tu PDF, DOCX o TXT y la IA lo leerá automáticamente.</p>
                  </div>
                </button>
              </div>

              <!-- Zona de importación de CV (Solo si startMode === 'import') -->
              <div 
                v-if="startMode === 'import'"
                class="w-full bg-slate-950/60 rounded-3xl border border-white/15 backdrop-blur-xl shadow-2xl overflow-hidden"
              >
                <!-- Estado: Progreso de parseo -->
                <div v-if="isParsingCV" class="p-8 text-center space-y-4">
                  <div class="flex items-center justify-center gap-3">
                    <div class="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                    <p class="text-sm font-bold text-indigo-300">{{ parseProgressLabel }}</p>
                  </div>
                  <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      class="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-500"
                      :style="{ width: parseProgress + '%' }"
                    ></div>
                  </div>
                  <p class="text-[10px] text-slate-500">Esto puede tomar 10-15 segundos...</p>
                </div>

                <!-- Estado: CV Importado Exitosamente -->
                <div v-else-if="parsedCVFileName" class="p-6 space-y-3">
                  <div class="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                    <span class="text-xl">✅</span>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-emerald-300">CV importado exitosamente</p>
                      <p class="text-[10px] text-slate-400 truncate">{{ parsedCVFileName }}</p>
                    </div>
                    <button 
                      @click="clearImportedCV"
                      class="text-slate-500 hover:text-red-400 text-xs font-bold transition-colors cursor-pointer flex-shrink-0"
                    >✕ Limpiar</button>
                  </div>
                  <p class="text-[11px] text-slate-400 font-light">Los datos de tu CV han sido extraídos. Continúa al Paso 2 para elegir el estándar de diseño, o ajusta el puesto objetivo abajo.</p>
                </div>

                <!-- Estado: Zona Drag & Drop normal -->
                <div 
                  v-else
                  class="p-6 space-y-4"
                  @dragover.prevent="isDraggingCV = true"
                  @dragleave="isDraggingCV = false"
                  @drop.prevent="handleCVDrop"
                >
                  <div 
                    :class="[
                      'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group',
                      isDraggingCV 
                        ? 'border-cyan-400 bg-cyan-500/10' 
                        : 'border-white/15 hover:border-indigo-500/50 hover:bg-slate-900/40'
                    ]"
                    @click="$refs.cvFileInput.click()"
                  >
                    <input 
                      ref="cvFileInput" 
                      type="file" 
                      accept=".pdf,.docx,.txt" 
                      class="hidden" 
                      @change="handleCVFileInputChange" 
                    />
                    <div class="space-y-3">
                      <div class="text-4xl">📁</div>
                      <div>
                        <p class="text-sm font-bold text-white">Arrastra tu CV aquí o haz clic para seleccionarlo</p>
                        <p class="text-[11px] text-slate-400 mt-1 font-light">Soporta <span class="text-cyan-400 font-semibold">.pdf</span>, <span class="text-cyan-400 font-semibold">.docx</span> y <span class="text-cyan-400 font-semibold">.txt</span> — Máx. 10MB</p>
                      </div>
                      <div class="flex items-center justify-center gap-4 text-[10px] text-slate-500">
                        <span>🔒 Procesado de forma segura</span>
                        <span>⚡ En segundos</span>
                        <span>🤖 Auto-rellenado por IA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Formulario de objetivo (siempre visible) -->
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <!-- Columna Izquierda (50%): Objetivo + Cargo -->
                <div class="lg:col-span-6 bg-slate-950/60 p-6 rounded-3xl border border-white/15 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-5 text-left">
                  
                  <!-- 1. Tipo de Objetivo -->
                  <div class="space-y-3">
                    <label class="block text-xs font-bold uppercase tracking-wider text-indigo-300">1. Tipo de Objetivo</label>
                    <p class="text-[11px] text-slate-400 font-light">Selecciona la meta de tu documento para orientar el tono de redacción.</p>
                    <div class="grid grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        v-for="meta in metas"
                        :key="meta"
                        @click="selectMeta(meta)"
                        :class="[
                          'rounded-xl py-3 px-2 text-center text-xs font-bold transition-all duration-300 border cursor-pointer',
                          objective === meta
                          ? 'border-indigo-500 bg-indigo-600/30 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.3)] scale-[1.02]'
                          : 'border-white/10 bg-slate-900/60 text-slate-400 hover:border-indigo-500/40 hover:bg-slate-900/90 hover:text-white'
                        ]"
                      >
                        {{ meta }}
                      </button>
                    </div>
                  </div>

                  <!-- 2. Cargo o Título Objetivo -->
                  <div class="space-y-2">
                    <label class="block text-xs font-bold uppercase tracking-wider text-indigo-300">2. Cargo o Título Objetivo</label>
                    <p class="text-[11px] text-slate-400 font-light">Escribe el puesto específico al que aspiras para enfocar el CV.</p>
                    <input
                      type="text"
                      v-model="targetJob"
                      class="w-full rounded-2xl border border-white/15 bg-slate-950/80 p-3.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none font-medium"
                      placeholder="Ej: Gerente de Operaciones / Senior Software Engineer"
                    />
                  </div>
                </div>

                <!-- Columna Derecha (50%): Descripción Amplia de la Vacante -->
                <div class="lg:col-span-6 bg-slate-950/60 p-6 rounded-3xl border border-white/15 backdrop-blur-xl shadow-2xl flex flex-col space-y-3 text-left">
                  <div class="flex items-center justify-between">
                    <label class="block text-xs font-bold uppercase tracking-wider text-indigo-300">3. Descripción de la Vacante</label>
                    <span class="text-[10px] text-indigo-300 font-semibold bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-lg">💡 Copia y Pega</span>
                  </div>
                  <p class="text-[11px] text-slate-400 font-light">Pega los requisitos de la oferta para que la IA extraiga y optimice las palabras clave ATS.</p>
                  <textarea
                    v-model="vacancyInfo"
                    class="w-full flex-1 min-h-[160px] resize-none rounded-2xl border border-white/15 bg-slate-950/80 p-3.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none font-light leading-relaxed custom-scrollbar-mini"
                    placeholder="Pega aquí la descripción del puesto, funciones requeridas o requisitos principales..."
                  ></textarea>
                </div>
              </div>
            </div>


            <!-- Paso 2 -->
            <div v-if="currentStep === 2" class="space-y-6">
              <CVSelectorExpert v-model="selectedCVType" />
            </div>

            <!-- Paso 3 (Personalización con Sugerencias Inteligentes de Título) -->
            <div v-if="currentStep === 3" class="space-y-6 animate-fade-in text-left">
              <div class="space-y-1 text-left">
                <span class="text-indigo-400 text-xs font-bold uppercase tracking-widest block">Personalización de Jerarquía</span>
                <h2 class="text-2xl font-bold text-white">Paso 3: Personaliza Títulos y Orden de Secciones</h2>
                <p class="text-xs text-slate-400 font-light">Edita los títulos a tu gusto, selecciona sugerencias rápidas o arrastra para reordenar la estructura de tu CV.</p>
              </div>

              <div class="w-full bg-slate-950/60 p-6 rounded-3xl border border-white/15 backdrop-blur-xl shadow-2xl space-y-4">
                <h4 class="font-bold text-xs uppercase tracking-wider text-indigo-300 flex items-center justify-between">
                  <span>Editar, Reordenar & Eliminar Secciones</span>
                  <button 
                    @click="addCustomSection" 
                    class="px-3 py-1.5 bg-indigo-600/30 border border-indigo-500/40 hover:bg-indigo-600/50 text-indigo-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <span>+ Agregar Nueva Sección</span>
                  </button>
                </h4>
                
                <draggable
                  v-model="finalStructure"
                  item-key="id"
                  class="space-y-3"
                  handle=".handle"
                >
                  <template #item="{ element, index }">
                    <div class="flex flex-col md:flex-row md:items-center gap-3 p-3.5 bg-slate-900 border border-white/10 rounded-2xl hover:border-indigo-500/40 transition-all group">
                      <div class="flex items-center gap-2 flex-1">
                        <span class="handle text-slate-500 font-bold cursor-move px-1 hover:text-indigo-400 text-base">⋮⋮</span>
                        <span class="w-5 h-5 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                          {{ index + 1 }}
                        </span>
                        <input 
                          type="text" 
                          v-model="element.label" 
                          class="flex-1 bg-slate-950/60 border border-white/10 px-3.5 py-2 rounded-xl text-xs font-semibold text-white focus:border-indigo-500 outline-none transition-all"
                          placeholder="Nombre de sección"
                        />
                      </div>

                      <!-- Sugerencias Rápidas de Títulos Alternativos -->
                      <div v-if="SECTION_TITLE_SUGGESTIONS[element.id]" class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar-mini py-1 pl-7 md:pl-0">
                        <span class="text-[10px] text-slate-500 font-medium whitespace-nowrap">Sugerencias:</span>
                        <button 
                          v-for="sug in SECTION_TITLE_SUGGESTIONS[element.id]" 
                          :key="sug" 
                          type="button"
                          @click="element.label = sug"
                          :class="[
                            'px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap cursor-pointer border',
                            element.label === sug 
                              ? 'bg-indigo-600/40 border-indigo-500 text-indigo-200 font-bold' 
                              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                          ]"
                        >
                          {{ sug }}
                        </button>
                      </div>

                      <!-- Botón Eliminar Sección -->
                      <button 
                        v-if="finalStructure.length > 1"
                        @click="removeSection(index)" 
                        title="Eliminar Sección"
                        class="px-2.5 py-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-xs font-bold transition-all cursor-pointer flex-shrink-0 ml-auto md:ml-0"
                      >
                        ✕
                      </button>
                    </div>
                  </template>
                </draggable>
              </div>
            </div>

            <!-- Paso 4 -->
            <div v-if="currentStep === 4" class="flex h-[84vh] gap-5 animate-fade-in w-full">
              
              <!-- Panel Izquierdo: Formulario Estructurado vs Copiloto Chat (70% Ancho) -->
              <div 
                v-show="viewMode === 'split' || viewMode === 'chat'"
                :class="[
                  'flex flex-col bg-slate-950/70 border border-white/15 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl transition-all duration-300',
                  viewMode === 'chat' ? 'w-full' : 'w-full md:w-[70%]'
                ]"
              >
                <!-- Pestañas Conmutadoras (Tab 1: Formulario | Tab 2: Chat) -->
                <div class="p-2 border-b border-white/10 bg-slate-900/90 flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-white/10 flex-1">
                    <button 
                      @click="switchTab('form')" 
                      :class="[
                        'flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5',
                        step4Mode === 'form' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                      ]"
                    >
                      <span>📝 Formulario Estructurado</span>
                    </button>
                    <button 
                      @click="switchTab('chat')" 
                      :class="[
                        'flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5',
                        step4Mode === 'chat' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                      ]"
                    >
                      <span>💬 Copiloto Conversacional</span>
                    </button>
                  </div>

                  <!-- Controles de Toggle Enfoque -->
                  <div class="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10">
                    <button 
                      @click="viewMode = 'chat'" 
                      :class="['px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer', viewMode === 'chat' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white']"
                      title="Ampliar al 100%"
                    >
                      ↔️ 100%
                    </button>
                    <button 
                      @click="viewMode = 'split'" 
                      :class="['px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer', viewMode === 'split' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white']"
                      title="Vista 60/40"
                    >
                      ⚖️ 60/40
                    </button>
                    <button 
                      @click="viewMode = 'preview'" 
                      :class="['px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer', viewMode === 'preview' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white']"
                      title="Ver Hoja Completa"
                    >
                      👁️ Hoja
                    </button>
                  </div>
                </div>

                <!-- CONTENIDO TAB 1: FORMULARIO ESTRUCTURADO ASISTIDO POR IA -->
                <div v-if="step4Mode === 'form'" class="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-5 bg-slate-950/40">
                  
                  <!-- Banner Superior con Botón ✨ Generar Borrador con IA -->
                  <div class="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-blue-950/80 p-4 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                    <div class="text-left">
                      <h3 class="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-2">
                        <span>✨ Generador de Borrador Completo</span>
                      </h3>
                      <p class="text-[11px] text-slate-400 font-light mt-0.5">Rellena los campos y presiona para compilar y aplicar la Fórmula XYZ de Google en el lienzo.</p>
                    </div>
                    <button 
                      @click="generateFullDraftWithAI"
                      :disabled="isAiLoading"
                      class="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer flex-shrink-0"
                    >
                      <span>{{ isAiLoading ? 'Compilando borrador...' : '✨ Generar borrador con IA' }}</span>
                    </button>
                  </div>
                  
                  <!-- BLOQUES DE FORMULARIO DINÁMICOS VINCULADOS A finalStructure -->
                  <template v-for="sec in finalStructure" :key="sec.id">
                    
                    <!-- 1. DATOS PERSONALES -->
                    <div v-if="sec.id === 'personal'" class="bg-slate-900/60 p-5 rounded-2xl border border-white/10 space-y-4 text-left">
                      <h3 class="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center justify-between">
                        <span>👤 {{ sec.label }}</span>
                        <span class="text-[10px] text-slate-500 font-normal capitalize">Estándar: {{ selectedCVType }}</span>
                      </h3>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label class="text-[10px] text-slate-400 font-bold uppercase block mb-1">Nombre Completo</label>
                          <input v-model="cvStore.content.personalInfo.fullName" type="text" class="w-full bg-slate-950/80 border border-white/10 p-2.5 rounded-xl text-xs text-white outline-none focus:border-indigo-500" placeholder="Ej: Carlos Mendoza" />
                        </div>
                        <div>
                          <label class="text-[10px] text-slate-400 font-bold uppercase block mb-1">Título Profesional</label>
                          <input v-model="cvStore.content.personalInfo.title" type="text" class="w-full bg-slate-950/80 border border-white/10 p-2.5 rounded-xl text-xs text-white outline-none focus:border-indigo-500" placeholder="Ej: Senior Software Engineer" />
                        </div>
                        <div>
                          <label class="text-[10px] text-slate-400 font-bold uppercase block mb-1">Correo Electrónico</label>
                          <input v-model="cvStore.content.personalInfo.email" type="email" class="w-full bg-slate-950/80 border border-white/10 p-2.5 rounded-xl text-xs text-white outline-none focus:border-indigo-500" placeholder="ejemplo@correo.com" />
                        </div>
                        <div>
                          <label class="text-[10px] text-slate-400 font-bold uppercase block mb-1">Teléfono</label>
                          <input v-model="cvStore.content.personalInfo.phone" type="text" class="w-full bg-slate-950/80 border border-white/10 p-2.5 rounded-xl text-xs text-white outline-none focus:border-indigo-500" placeholder="+51 987 654 321" />
                        </div>

                        <div v-if="cvStore.content.personalInfo.links">
                          <label class="text-[10px] text-slate-400 font-bold uppercase block mb-1">LinkedIn URL</label>
                          <input v-model="cvStore.content.personalInfo.links.linkedin" type="text" class="w-full bg-slate-950/80 border border-white/10 p-2.5 rounded-xl text-xs text-indigo-300 outline-none focus:border-indigo-500" placeholder="https://linkedin.com/in/usuario" />
                        </div>

                        <template v-if="selectedCVType === 'tech' && cvStore.content.personalInfo.links">
                          <div>
                            <label class="text-[10px] text-slate-400 font-bold uppercase block mb-1">GitHub URL</label>
                            <input v-model="cvStore.content.personalInfo.links.github" type="text" class="w-full bg-slate-950/80 border border-white/10 p-2.5 rounded-xl text-xs text-indigo-300 outline-none focus:border-indigo-500" placeholder="https://github.com/usuario" />
                          </div>
                          <div>
                            <label class="text-[10px] text-slate-400 font-bold uppercase block mb-1">Portafolio URL</label>
                            <input v-model="cvStore.content.personalInfo.links.portfolio" type="text" class="w-full bg-slate-950/80 border border-white/10 p-2.5 rounded-xl text-xs text-indigo-300 outline-none focus:border-indigo-500" placeholder="https://portafolio.dev" />
                          </div>
                        </template>

                        <template v-if="selectedCVType === 'europass' || selectedCVType === 'creativo'">
                          <div class="sm:col-span-2 space-y-1">
                            <label class="text-[10px] text-slate-400 font-bold uppercase block mb-1">Foto de Perfil (Supabase Storage / URL)</label>
                            <div class="flex items-center gap-2">
                              <input v-model="cvStore.content.personalInfo.photo" type="text" class="flex-1 bg-slate-950/80 border border-white/10 p-2.5 rounded-xl text-xs text-white outline-none focus:border-indigo-500" placeholder="https://imagen.com/foto.jpg" />
                              <label class="px-3.5 py-2.5 bg-indigo-600/30 border border-indigo-500/40 hover:bg-indigo-600/50 text-indigo-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0">
                                <span>{{ isUploadingPhoto ? 'Subiendo...' : '📷 Subir Foto' }}</span>
                                <input type="file" accept="image/*" @change="handlePhotoUpload" class="hidden" />
                              </label>
                            </div>
                          </div>
                          <div>
                            <label class="text-[10px] text-slate-400 font-bold uppercase block mb-1">Skype ID</label>
                            <input v-model="cvStore.content.personalInfo.skype" type="text" class="w-full bg-slate-950/80 border border-white/10 p-2.5 rounded-xl text-xs text-white outline-none focus:border-indigo-500" placeholder="skype.user" />
                          </div>
                        </template>
                      </div>
                    </div>

                    <!-- 2. RESUMEN PROFESIONAL -->
                    <div v-else-if="sec.id === 'summary'" class="bg-slate-900/60 p-5 rounded-2xl border border-white/10 space-y-3 text-left">
                      <div class="flex items-center justify-between">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-indigo-300">📄 {{ sec.label }}</h3>
                        <button 
                          @click="optimizeSectionWithAI('summary', cvStore.content.summary)" 
                          :disabled="isAiLoading"
                          class="px-3 py-1.5 bg-indigo-600/20 border border-indigo-500/40 hover:bg-indigo-600/40 text-indigo-200 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span>✨ Optimizar con IA</span>
                        </button>
                      </div>
                      <textarea 
                        v-model="cvStore.content.summary" 
                        rows="4" 
                        class="w-full bg-slate-950/80 border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-light resize-none" 
                        placeholder="Escribe tu resumen breve o presiona 'Optimizar con IA'..."
                      ></textarea>
                    </div>

                    <!-- 3. EXPERIENCIA PROFESIONAL -->
                    <div v-else-if="sec.id === 'experience'" class="bg-slate-900/60 p-5 rounded-2xl border border-white/10 space-y-4 text-left">
                      <div class="flex items-center justify-between">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-indigo-300">💼 {{ sec.label }} (Fórmula XYZ)</h3>
                        <div class="flex items-center gap-2">
                          <button @click="addExperienceItem" class="px-2.5 py-1 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 rounded-lg text-[10px] font-bold cursor-pointer">+ Agregar Puesto</button>
                          <button 
                            @click="optimizeSectionWithAI('experience', JSON.stringify(cvStore.content.experience))" 
                            :disabled="isAiLoading"
                            class="px-3 py-1.5 bg-indigo-600/20 border border-indigo-500/40 hover:bg-indigo-600/40 text-indigo-200 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <span>✨ Optimizar con Fórmula XYZ</span>
                          </button>
                        </div>
                      </div>

                      <div v-for="(exp, idx) in cvStore.content.experience" :key="idx" class="p-4 bg-slate-950/70 border border-white/10 rounded-xl space-y-3 relative group">
                        <button @click="removeExperienceItem(idx)" class="absolute top-3 right-3 text-slate-500 hover:text-red-400 text-xs font-bold cursor-pointer">✕</button>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input v-model="exp.title" type="text" placeholder="Cargo (Ej: Senior Developer)" class="bg-slate-900 border border-white/10 p-2 rounded-lg text-xs text-white outline-none focus:border-indigo-500 font-semibold" />
                          <input v-model="exp.company" type="text" placeholder="Empresa (Ej: Empresa Tech)" class="bg-slate-900 border border-white/10 p-2 rounded-lg text-xs text-white outline-none focus:border-indigo-500" />
                          <input v-model="exp.location" type="text" placeholder="Ubicación (Ej: Ciudad, País)" class="bg-slate-900 border border-white/10 p-2 rounded-lg text-xs text-slate-300 outline-none focus:border-indigo-500 sm:col-span-2" />
                        </div>

                        <!-- Selector de Fechas estructurado (Mes/Año + Casilla Actualmente) -->
                        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-white/10 items-center">
                          <div class="sm:col-span-5 flex items-center gap-1.5">
                            <span class="text-[9px] text-slate-400 font-bold uppercase whitespace-nowrap">Inicio:</span>
                            <select v-model="exp.startMonth" @change="updateItemDates(exp)" class="bg-slate-950 border border-white/10 p-1 rounded-lg text-[11px] text-white outline-none">
                              <option value="">Mes</option>
                              <option v-for="m in MONTHS_LIST" :key="m" :value="m">{{ m }}</option>
                            </select>
                            <input v-model="exp.startYear" @input="updateItemDates(exp)" type="text" placeholder="Año" class="w-16 bg-slate-950 border border-white/10 p-1 rounded-lg text-[11px] text-white outline-none font-mono" />
                          </div>

                          <div class="sm:col-span-2 flex items-center justify-center gap-1.5">
                            <input type="checkbox" :id="'exp-curr-'+idx" v-model="exp.isCurrent" @change="updateItemDates(exp)" class="w-3.5 h-3.5 accent-indigo-500 cursor-pointer" />
                            <label :for="'exp-curr-'+idx" class="text-[10px] text-indigo-300 font-bold cursor-pointer whitespace-nowrap">Actualmente</label>
                          </div>

                          <div v-if="!exp.isCurrent" class="sm:col-span-5 flex items-center gap-1.5">
                            <span class="text-[9px] text-slate-400 font-bold uppercase whitespace-nowrap">Fin:</span>
                            <select v-model="exp.endMonth" @change="updateItemDates(exp)" class="bg-slate-950 border border-white/10 p-1 rounded-lg text-[11px] text-white outline-none">
                              <option value="">Mes</option>
                              <option v-for="m in MONTHS_LIST" :key="m" :value="m">{{ m }}</option>
                            </select>
                            <input v-model="exp.endYear" @input="updateItemDates(exp)" type="text" placeholder="Año" class="w-16 bg-slate-950 border border-white/10 p-1 rounded-lg text-[11px] text-white outline-none font-mono" />
                          </div>
                        </div>
                        
                        <div>
                          <label class="text-[10px] text-slate-400 font-bold uppercase block mb-1">Viñetas de Logros (Separa con saltos de línea)</label>
                          <textarea 
                            :value="Array.isArray(exp.description) ? exp.description.join('\n') : exp.description"
                            @input="exp.description = $event.target.value.split('\n')"
                            rows="3" 
                            class="w-full bg-slate-900 border border-white/10 p-2.5 rounded-lg text-xs text-slate-200 outline-none focus:border-indigo-500 font-light resize-none"
                            placeholder="- Logré X, medido por Y, haciendo Z..."
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <!-- 4. PROYECTOS DESTACADOS -->
                    <div v-else-if="sec.id === 'projects'" class="bg-slate-900/60 p-5 rounded-2xl border border-white/10 space-y-4 text-left">
                      <div class="flex items-center justify-between">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-indigo-300">🚀 {{ sec.label }}</h3>
                        <div class="flex items-center gap-2">
                          <button @click="addProjectItem" class="px-2.5 py-1 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 rounded-lg text-[10px] font-bold cursor-pointer">+ Agregar Proyecto</button>
                          <button 
                            @click="optimizeSectionWithAI('projects', JSON.stringify(cvStore.content.projects))" 
                            :disabled="isAiLoading"
                            class="px-3 py-1.5 bg-indigo-600/20 border border-indigo-500/40 hover:bg-indigo-600/40 text-indigo-200 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                          >
                            <span>✨ Optimizar Proyectos</span>
                          </button>
                        </div>
                      </div>

                      <div v-for="(proj, pIdx) in cvStore.content.projects" :key="pIdx" class="p-4 bg-slate-950/70 border border-white/10 rounded-xl space-y-3 relative">
                        <button @click="removeProjectItem(pIdx)" class="absolute top-3 right-3 text-slate-500 hover:text-red-400 text-xs font-bold cursor-pointer">✕</button>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input v-model="proj.title" type="text" placeholder="Nombre del Proyecto" class="bg-slate-900 border border-white/10 p-2 rounded-lg text-xs text-white font-semibold outline-none focus:border-indigo-500" />
                          <input v-model="proj.company" type="text" placeholder="Enlace GitHub / Demo" class="bg-slate-900 border border-white/10 p-2 rounded-lg text-xs text-indigo-300 outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                          <label class="text-[10px] text-slate-400 font-bold uppercase block mb-1">Descripción del Proyecto</label>
                          <textarea 
                            :value="Array.isArray(proj.description) ? proj.description.join('\n') : proj.description"
                            @input="proj.description = $event.target.value.split('\n')"
                            rows="2" 
                            class="w-full bg-slate-900 border border-white/10 p-2 rounded-lg text-xs text-slate-200 outline-none focus:border-indigo-500 font-light resize-none"
                            placeholder="Descripción técnica del proyecto..."
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <!-- 5. STACK TECNOLÓGICO / SKILLS (Con Edición de Categorías Personalizadas) -->
                    <div v-else-if="sec.id === 'stack' || sec.id === 'skills'" class="bg-slate-900/60 p-5 rounded-2xl border border-white/10 space-y-4 text-left">
                      <div class="flex items-center justify-between">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-indigo-300">🛠️ {{ sec.label }}</h3>
                        <div class="flex items-center gap-2">
                          <button @click="addStackCategory" class="px-2.5 py-1 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 rounded-lg text-[10px] font-bold cursor-pointer">+ Agregar Categoría</button>
                          <button 
                            @click="optimizeSectionWithAI('stack', JSON.stringify(cvStore.content.stack))" 
                            :disabled="isAiLoading"
                            class="px-3 py-1.5 bg-indigo-600/20 border border-indigo-500/40 hover:bg-indigo-600/40 text-indigo-200 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <span>✨ Categorizar con IA</span>
                          </button>
                        </div>
                      </div>

                      <div v-for="(cat, cIdx) in cvStore.content.stack" :key="cIdx" class="p-3 bg-slate-950/70 border border-white/10 rounded-xl space-y-2 relative group">
                        <button @click="removeStackCategory(cIdx)" class="absolute top-2.5 right-2.5 text-slate-500 hover:text-red-400 text-xs font-bold cursor-pointer">✕</button>
                        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                          <!-- Término de Antes (Nombre de la Categoría: ej. Backend) -->
                          <div class="sm:col-span-4">
                            <label class="text-[9px] text-slate-400 font-bold uppercase block mb-1">Categoría (Ej: Backend)</label>
                            <input 
                              v-model="cat.category" 
                              type="text" 
                              class="w-full bg-slate-900 border border-white/10 p-2 rounded-lg text-xs text-indigo-300 font-bold outline-none focus:border-indigo-500" 
                              placeholder="Ej: Backend" 
                            />
                          </div>
                          <!-- Término de Después (Tecnologías / Items) -->
                          <div class="sm:col-span-8 pr-6 sm:pr-0">
                            <label class="text-[9px] text-slate-400 font-bold uppercase block mb-1">Tecnologías (Ej: Java • Python • Node.js)</label>
                            <input 
                              :value="Array.isArray(cat.items) ? cat.items.join(' • ') : cat.items" 
                              @input="cat.items = $event.target.value.split('•').map(s => s.trim())" 
                              type="text" 
                              class="w-full bg-slate-900 border border-white/10 p-2 rounded-lg text-xs text-white outline-none focus:border-indigo-500 font-mono" 
                              placeholder="Java • Python • Node.js" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 6. EDUCACIÓN & CERTIFICACIONES -->
                    <div v-else-if="sec.id === 'education'" class="bg-slate-900/60 p-5 rounded-2xl border border-white/10 space-y-4 text-left">
                      <div class="flex items-center justify-between">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-indigo-300">🎓 {{ sec.label }}</h3>
                        <button @click="addEducationItem" class="px-2.5 py-1 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 rounded-lg text-[10px] font-bold cursor-pointer">+ Agregar Educación</button>
                      </div>
                      <div v-for="(edu, eIdx) in cvStore.content.education" :key="eIdx" class="p-4 bg-slate-950/70 border border-white/10 rounded-xl space-y-3 relative">
                        <button @click="removeEducationItem(eIdx)" class="absolute top-3 right-3 text-slate-500 hover:text-red-400 text-xs font-bold cursor-pointer">✕</button>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input v-model="edu.degree" type="text" placeholder="Título / Grado Académico" class="bg-slate-900 border border-white/10 p-2 rounded-lg text-xs text-white font-semibold outline-none focus:border-indigo-500" />
                          <input v-model="edu.institution" type="text" placeholder="Universidad / Institución" class="bg-slate-900 border border-white/10 p-2 rounded-lg text-xs text-slate-200 outline-none focus:border-indigo-500" />
                        </div>

                        <!-- Selector de Fechas estructurado (Mes/Año + Casilla Actualmente) -->
                        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-white/10 items-center">
                          <div class="sm:col-span-5 flex items-center gap-1.5">
                            <span class="text-[9px] text-slate-400 font-bold uppercase whitespace-nowrap">Inicio:</span>
                            <select v-model="edu.startMonth" @change="updateItemDates(edu)" class="bg-slate-950 border border-white/10 p-1 rounded-lg text-[11px] text-white outline-none">
                              <option value="">Mes</option>
                              <option v-for="m in MONTHS_LIST" :key="m" :value="m">{{ m }}</option>
                            </select>
                            <input v-model="edu.startYear" @input="updateItemDates(edu)" type="text" placeholder="Año" class="w-16 bg-slate-950 border border-white/10 p-1 rounded-lg text-[11px] text-white outline-none font-mono" />
                          </div>

                          <div class="sm:col-span-2 flex items-center justify-center gap-1.5">
                            <input type="checkbox" :id="'edu-curr-'+eIdx" v-model="edu.isCurrent" @change="updateItemDates(edu)" class="w-3.5 h-3.5 accent-indigo-500 cursor-pointer" />
                            <label :for="'edu-curr-'+eIdx" class="text-[10px] text-indigo-300 font-bold cursor-pointer whitespace-nowrap">Actualmente</label>
                          </div>

                          <div v-if="!edu.isCurrent" class="sm:col-span-5 flex items-center gap-1.5">
                            <span class="text-[9px] text-slate-400 font-bold uppercase whitespace-nowrap">Fin:</span>
                            <select v-model="edu.endMonth" @change="updateItemDates(edu)" class="bg-slate-950 border border-white/10 p-1 rounded-lg text-[11px] text-white outline-none">
                              <option value="">Mes</option>
                              <option v-for="m in MONTHS_LIST" :key="m" :value="m">{{ m }}</option>
                            </select>
                            <input v-model="edu.endYear" @input="updateItemDates(edu)" type="text" placeholder="Año" class="w-16 bg-slate-950 border border-white/10 p-1 rounded-lg text-[11px] text-white outline-none font-mono" />
                          </div>
                        </div>

                        <div>
                          <label class="text-[10px] text-slate-400 font-bold uppercase block mb-1">Detalles / Logros Académicos (Separa con saltos de línea)</label>
                          <textarea 
                            :value="Array.isArray(edu.description) ? edu.description.join('\n') : (edu.description || '')"
                            @input="edu.description = $event.target.value.split('\n')"
                            rows="2" 
                            class="w-full bg-slate-900 border border-white/10 p-2 rounded-lg text-xs text-slate-200 outline-none focus:border-indigo-500 font-light resize-none"
                            placeholder="Mención de honor, proyectos finales, cursos relevantes..."
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <!-- 7. EDITOR UNIVERSAL DE SECCIÓN (Para cualquier título/sección extra o personalizada) -->
                    <div v-else class="bg-slate-900/60 p-5 rounded-2xl border border-white/10 space-y-3 text-left">
                      <div class="flex items-center justify-between">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-indigo-300">📝 {{ sec.label }}</h3>
                        <button 
                          @click="optimizeSectionWithAI(sec.id, JSON.stringify(cvStore.content[sec.id] || []))" 
                          :disabled="isAiLoading"
                          class="px-3 py-1.5 bg-indigo-600/20 border border-indigo-500/40 hover:bg-indigo-600/40 text-indigo-200 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span>✨ Optimizar con IA</span>
                        </button>
                      </div>
                      <textarea 
                        :value="Array.isArray(cvStore.content[sec.id]) ? cvStore.content[sec.id].join('\n') : (cvStore.content[sec.id] || '')"
                        @input="cvStore.content[sec.id] = $event.target.value.split('\n')"
                        rows="3" 
                        class="w-full bg-slate-950/80 border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-light resize-none" 
                        :placeholder="'Ingresa los detalles para ' + sec.label + ' (un elemento por línea)...'"
                      ></textarea>
                    </div>

                  </template>

                </div>

                <!-- CONTENIDO TAB 2: COPILOTO CONVERSACIONAL -->
                <div v-else-if="step4Mode === 'chat'" class="flex-1 flex flex-col min-h-0 bg-slate-950/40">
                  
                  <!-- Header del Chat con Botón de Acceso Rápido [ 📝 Ir al Formulario Estructurado ] -->
                  <div class="p-3 border-b border-white/10 bg-slate-900/90 flex items-center justify-between gap-2 text-left">
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span class="text-xs font-bold text-white">Copiloto Conversacional IA</span>
                    </div>
                    <button 
                      @click="switchTab('form')"
                      class="px-3 py-1.5 bg-indigo-600/30 border border-indigo-500/40 hover:bg-indigo-600/50 text-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>📝 Ir al Formulario Estructurado</span>
                    </button>
                  </div>

                  <div class="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-4">
                    <div v-for="msg in chatHistory" :key="msg.id" 
                      :class="[
                        'max-w-[90%] p-4 rounded-2xl border transition-all duration-300 text-xs leading-relaxed max-h-none',
                        msg.role === 'user' 
                          ? 'ml-auto bg-slate-900 border-indigo-500/30 text-white rounded-tr-none shadow-md' 
                          : 'mr-auto bg-indigo-950/60 border-indigo-500/30 text-slate-200 rounded-tl-none shadow-md'
                      ]">
                      
                      <div v-if="msg.role === 'assistant'" class="flex items-center gap-2 mb-1.5 opacity-70">
                        <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Craft.AI Copiloto</span>
                      </div>

                      <p class="whitespace-pre-line font-light leading-normal">
                        {{ msg.text }}
                      </p>

                      <!-- Tarjeta de Propuesta Sugerida con Botón [ 📥 Aplicar Cambio ] -->
                      <div v-if="msg.proposalData" class="mt-3 p-3 bg-indigo-950/90 border border-indigo-500/40 rounded-xl space-y-2 text-left">
                        <div class="flex items-center justify-between text-[11px] text-indigo-300 font-bold">
                          <span>💡 Propuesta Sugerida por Craft.AI</span>
                          <span v-if="msg.sectionName" class="text-[10px] text-slate-400 capitalize">Sección: {{ msg.sectionName }}</span>
                        </div>
                        <p class="text-[11px] text-slate-200 font-light leading-relaxed">
                          Presiona el botón para aplicar esta optimización directamente en tu formulario y en la vista previa del documento.
                        </p>
                        <button 
                          @click="applyAIProposal(msg.proposalData, msg.sectionName)" 
                          class="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                        >
                          <span>📥 Aplicar Cambio</span>
                        </button>
                      </div>
                    </div>

                    <div v-if="isAiLoading" class="mr-auto bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-2xl rounded-tl-none animate-pulse">
                      <div class="flex gap-2">
                        <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  </div>

                  <div class="p-4 bg-slate-900/80 border-t border-white/10">
                    <textarea
                      v-model="userMessage"
                      @keyup.enter.exact="sendMessage"
                      rows="2"
                      class="w-full bg-slate-950/90 p-3 text-white text-xs placeholder:text-slate-500 outline-none resize-none custom-scrollbar border border-white/15 rounded-xl focus:border-indigo-500 transition-all font-light"
                      placeholder="Escribe a Craft.AI (Ej: agrega mi experiencia en Amazon, mejora logros con métricas...)"
                    ></textarea>
                    
                    <div class="flex justify-between items-center mt-2">
                      <p class="text-[10px] text-slate-400">Enter para enviar • Shift+Enter para nueva línea</p>
                      <button 
                        @click="sendMessage"
                        :disabled="isAiLoading"
                        class="flex items-center gap-2 
                              bg-gradient-to-r from-indigo-600 to-blue-600 
                              px-5 py-2 rounded-xl transition-all duration-300
                              hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs
                              active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
                      >
                        <span>{{ isAiLoading ? 'Optimizando...' : 'Enviar' }}</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              <!-- Panel de Vista Previa del Documento (30% Ancho) -->
              <div 
                v-show="viewMode === 'split' || viewMode === 'preview'"
                :class="[
                  'flex flex-col bg-slate-950/70 border border-white/15 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl transition-all duration-300',
                  viewMode === 'preview' ? 'w-full' : 'w-full md:w-[30%]'
                ]"
              >
                <div class="p-3.5 border-b border-white/10 bg-slate-900/80 flex items-center justify-between z-10">
                  <span class="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                    Vista Previa en Tiempo Real
                  </span>
                  <button 
                    v-if="viewMode === 'preview'"
                    @click="viewMode = 'split'"
                    class="text-[10px] font-bold text-slate-400 hover:text-white bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 cursor-pointer"
                  >
                    ← Volver a Vista Dividida
                  </button>
                </div>

                <div class="flex-1 overflow-y-auto custom-scrollbar-mini p-4 flex justify-center items-start">
                  <div 
                    :class="[
                      'origin-top transition-transform duration-300 transform shadow-2xl',
                      viewMode === 'preview' ? 'scale-[0.75] my-4' : 'scale-[0.38]'
                    ]" 
                    :style="viewMode === 'preview' ? 'min-width: 210mm;' : 'margin-bottom: -720px; min-width: 210mm;'"
                  > 
                    <CvPreviewPanel :structure="finalStructure" :highlightSection="recentlyUpdatedSection" />
                  </div>
                </div>
              </div>

            </div>

            <!-- Paso 5 -->
            <div v-if="currentStep === 5" class="w-full px-2 pt-0 pb-4 animate-fade-in relative z-[100]">
              <header class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold mb-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    ✏️ Modo Edición Directa Activado
                  </div>
                  <h2 class="text-2xl font-bold text-white tracking-tight">Paso 5: Exportación y Edición Final</h2>
                  <p class="text-xs text-slate-400 font-light mt-1">Haz clic directamente sobre cualquier texto o viñeta de la vista previa para editarlo antes de exportar.</p>
                </div>

                <!-- Barra de Herramientas Flotante / Controles Rápidos -->
                <div class="flex flex-wrap items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-white/15 backdrop-blur-xl shadow-xl">
                  
                  <!-- Paleta de Colores de Acento -->
                  <div class="flex items-center gap-2 border-r border-white/10 pr-3">
                    <span class="text-[10px] uppercase font-bold text-slate-400">Color Acento:</span>
                    <div class="flex gap-1.5">
                      <button v-for="color in ['#1e293b', '#312e81', '#059669', '#7c3aed', '#1e3a8a']" 
                        :key="color"
                        @click="cvStore.customColor = color"
                        class="w-5 h-5 rounded-full border border-white/20 transition-transform hover:scale-125 cursor-pointer"
                        :style="{ backgroundColor: color }"></button>
                    </div>
                  </div>

                  <!-- Ajuste de Fuente -->
                  <div class="flex items-center gap-1.5 border-r border-white/10 pr-3">
                    <button @click="decreaseSize" class="px-2 py-1 bg-white/5 border border-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-bold cursor-pointer">A-</button>
                    <span class="text-xs text-slate-300 font-mono">{{ fontSizeBase }}pt</span>
                    <button @click="increaseSize" class="px-2 py-1 bg-white/5 border border-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-bold cursor-pointer">A+</button>
                  </div>

                  <!-- Botón Restablecer IA -->
                  <button @click="restoreOriginalAIContent" class="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-300 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5">
                    <span>↺ Restablecer IA</span>
                  </button>

                </div>
              </header>

              <div class="flex flex-col sm:flex-row gap-4 mb-8">
                <button @click="downloadPDF" 
                  class="flex-1 group relative flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.01] shadow-lg active:scale-95 cursor-pointer">
                  <span>Descargar CV en PDF (Alta Resolución)</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>

                <button @click="saveCV(true)" :disabled="isSaving"
                  class="flex-1 flex items-center justify-center gap-2 bg-slate-900 border border-white/15 py-4 rounded-2xl text-slate-200 text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Guardar como nueva versión en Supabase
                </button>
              </div>

              <div>
                <CvPreviewPanel :structure="finalStructure" :fontSizeBase="fontSizeBase" :marginValue="marginValue" />
              </div>
            </div>
            
          </div>
        </div>
      </main>

      <footer class="fixed bottom-0 left-0 z-30 w-full bg-slate-950/90 backdrop-blur-xl border-t border-white/10 px-6 py-4">
        <div class="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <button
            type="button"
            class="rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-6 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            @click="prevStep"
            :disabled="currentStep === 1"
          >
            ← Paso Anterior
          </button>
          <button
            type="button"
            class="rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-8 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            @click="nextStep"
          >
            {{ currentStep === 5 ? 'Finalizar' : 'Siguiente Paso →' }}
          </button>
        </div>
      </footer>
  
    </div>
    <Transition name="toast">
      <div v-if="showErrorToast" class="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-md px-4">
        <div class="flex items-center gap-3.5 bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/30 p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
          <div class="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
            ℹ️
          </div>
          <div class="flex-1">
            <p class="text-xs font-semibold text-slate-100 leading-snug">{{ toastMessage }}</p>
          </div>
          <button @click="showErrorToast = false" class="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer">
            ✕
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCvStore } from '@/stores/cv';
import { storeToRefs } from 'pinia';
import { supabase } from '@/lib/supabase';
import CvPreviewPanel from './CvPreviewPanel.vue';
import CVSelectorExpert from './CVSelectorExpert.vue';
import Navbar from '@/components/Navbar.vue';
import draggable from 'vuedraggable';
import html2pdf from 'html2pdf.js';
import { CV_STANDARDS } from '@/constants/cvStandards'; 
import { apiService } from '@/services/api';

// 1. Inicializamos los stores
const router = useRouter();
const authStore = useAuthStore();
const cvStore = useCvStore();

// 2. Vinculamos reactivamente todo el estado al store para guardar progreso entre pasos
const { 
  currentStep, 
  chatHistory, 
  targetJob, 
  vacancyInfo, 
  cvType: selectedCVType, 
  structureOrder: finalStructure, 
  objective 
} = storeToRefs(cvStore); 

// 3. Estado local de UI
const SECTION_TITLE_SUGGESTIONS = {
  personal: ['Datos Personales', 'Contacto & Perfil', 'Información de Contacto', 'Personal Details'],
  summary: ['Resumen Profesional', 'Perfil Ejecutivo', 'Sobre Mí', 'Executive Summary'],
  experience: ['Experiencia Profesional', 'Trayectoria Laboral', 'Experiencia Relevante', 'Work Experience'],
  education: ['Educación & Certificaciones', 'Historial Académico', 'Formación y Grados', 'Education & Credentials'],
  projects: ['Proyectos Destacados', 'Portafolio de Proyectos', 'Iniciativas Clave', 'Technical Projects'],
  stack: ['Stack Tecnológico', 'Competencias & Herramientas', 'Habilidades Técnicas', 'Skills & Tools'],
  languages: ['Idiomas', 'Dominio de Lenguas', 'Languages', 'Idiomas & Dialectos']
};

const showErrorToast = ref(false);
const toastMessage = ref('');
const chatContainer = ref(null);
const userMessage = ref('');
const isAiLoading = ref(false);
const isUploadingPhoto = ref(false);
const viewMode = ref('split');
const step4Mode = ref('form');
const recentlyUpdatedSection = ref(null);

// --- Estado de importación de CV ---
const startMode = ref('scratch'); // 'scratch' | 'import'
const isParsingCV = ref(false);
const parseProgress = ref(0);
const parseProgressLabel = ref('Extrayendo texto del documento...');
const parsedCVFileName = ref('');
const isDraggingCV = ref(false);
const cvFileInput = ref(null);

async function handleCVFileUpload(file) {
  if (!file) return;

  // Validar tamaño (máx 10MB)
  if (file.size > 10 * 1024 * 1024) {
    triggerAlert('El archivo es demasiado grande. Por favor sube un archivo menor a 10MB.');
    return;
  }

  isParsingCV.value = true;
  parseProgress.value = 20;
  parseProgressLabel.value = 'Enviando documento al servidor...';

  try {
    parseProgress.value = 30;
    parseProgressLabel.value = 'Leyendo documento...';

    // Leer el archivo como base64 en el browser (nativo, sin librerías)
    const fileBase64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // e.target.result = "data:application/pdf;base64,XXXX..." → extraer solo el base64
        const base64 = e.target.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsDataURL(file);
    });

    parseProgress.value = 50;
    parseProgressLabel.value = 'Extrayendo texto e interpretando con IA...';

    // Enviar al backend como JSON con base64 (funciona en Vercel serverless)
    let backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    if (backendUrl && !backendUrl.endsWith('/api')) {
      backendUrl = backendUrl.replace(/\/$/, '') + '/api';
    }
    const response = await fetch(`${backendUrl}/cv/parse`, {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileBase64,
        fileName: file.name,
        mimeType: file.type,
        cvType: selectedCVType.value || 'harvard',
        targetJob: targetJob.value || ''
      })
    });


    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Error del servidor: ${response.status}`);
    }

    parseProgress.value = 85;
    parseProgressLabel.value = 'Rellenando formulario y vista previa...';

    const data = await response.json();
    const cvData = data.cvData || data;

    // Auto-rellenar el store con los datos extraídos
    if (cvData) {
      if (cvData.personalInfo) {
        cvStore.content.personalInfo = { ...cvStore.content.personalInfo, ...cvData.personalInfo };
      }
      if (cvData.summary !== undefined) cvStore.content.summary = cvData.summary;
      if (Array.isArray(cvData.experience) && cvData.experience.length > 0) {
        cvStore.content.experience = cvData.experience;
      }
      if (Array.isArray(cvData.education) && cvData.education.length > 0) {
        cvStore.content.education = cvData.education;
      }
      if (Array.isArray(cvData.projects) && cvData.projects.length > 0) {
        cvStore.content.projects = cvData.projects;
      }
      if (Array.isArray(cvData.stack) && cvData.stack.length > 0) {
        cvStore.content.stack = cvData.stack;
      }
      if (Array.isArray(cvData.languages) && cvData.languages.length > 0) {
        cvStore.content.languages = cvData.languages;
      }

      // Pre-rellenar el cargo objetivo si el CV tiene título y no se ha puesto aún
      if (cvData.personalInfo?.title && !targetJob.value) {
        targetJob.value = cvData.personalInfo.title;
      }
    }

    parseProgress.value = 100;
    parsedCVFileName.value = file.name;

    // Mensaje de bienvenida en el chat del Copiloto
    const expCount = Array.isArray(cvData?.experience) ? cvData.experience.filter(e => e.title).length : 0;
    const eduCount = Array.isArray(cvData?.education) ? cvData.education.filter(e => e.degree).length : 0;
    const welcomeMsg = `¡He importado con éxito la información de tu CV anterior! He organizado ${expCount > 0 ? expCount + ' experiencia' + (expCount > 1 ? 's' : '') : 'tus datos'} y ${eduCount > 0 ? eduCount + ' registro' + (eduCount > 1 ? 's' : '') + ' de educación' : 'tu perfil'} en la hoja. ¿Qué sección te gustaría optimizar primero?`;
    
    cvStore.chatHistory = [{
      id: Date.now(),
      role: 'assistant',
      text: welcomeMsg
    }];

    triggerAlert(`✅ ¡CV importado! ${expCount > 0 ? expCount + ' exp. encontradas.' : 'Datos extraídos correctamente.'}`);

  } catch (err) {
    console.error('Error al importar CV:', err);
    triggerAlert('Error al procesar el CV: ' + (err.message || 'Inténtalo de nuevo.'));
  } finally {
    isParsingCV.value = false;
    setTimeout(() => { parseProgress.value = 0; }, 1000);
  }
}

function handleCVDrop(event) {
  isDraggingCV.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) handleCVFileUpload(file);
}

function handleCVFileInputChange(event) {
  const file = event.target?.files?.[0];
  if (file) handleCVFileUpload(file);
  // Reset input para permitir subir el mismo archivo de nuevo
  if (cvFileInput.value) cvFileInput.value.value = '';
}

function clearImportedCV() {
  parsedCVFileName.value = '';
  parseProgress.value = 0;
  isDraggingCV.value = false;
}

async function handlePhotoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    isUploadingPhoto.value = true;

    if (!supabase) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!cvStore.content.personalInfo) cvStore.content.personalInfo = {};
        cvStore.content.personalInfo.photo = e.target.result;
        cvStore.content.personalInfo.photo_url = e.target.result;
        triggerAlert("✨ Foto cargada correctamente en la vista previa.");
      };
      reader.readAsDataURL(file);
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    let bucketName = 'avatars';
    let { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file);

    if (uploadError) {
      bucketName = 'cv-media';
      const fallbackUpload = await supabase.storage.from(bucketName).upload(filePath, file);
      if (fallbackUpload.error) throw fallbackUpload.error;
    }

    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    const publicUrl = publicUrlData?.publicUrl;

    if (!cvStore.content.personalInfo) cvStore.content.personalInfo = {};
    cvStore.content.personalInfo.photo = publicUrl;
    cvStore.content.personalInfo.photo_url = publicUrl;

    triggerAlert("✨ Foto de perfil subida exitosamente a Supabase Storage.");
  } catch (error) {
    console.error("Error subiendo foto:", error);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!cvStore.content.personalInfo) cvStore.content.personalInfo = {};
      cvStore.content.personalInfo.photo = e.target.result;
      cvStore.content.personalInfo.photo_url = e.target.result;
      triggerAlert("✨ Foto cargada en la vista previa del documento.");
    };
    reader.readAsDataURL(file);
  } finally {
    isUploadingPhoto.value = false;
  }
}

function switchTab(newMode) {
  step4Mode.value = newMode;
  if (newMode === 'chat') {
    const formHasData = cvStore.content?.personalInfo?.fullName || (Array.isArray(cvStore.content?.experience) && cvStore.content.experience.length > 0);
    
    if (formHasData) {
      const syncText = "¡He procesado tus datos del formulario! Todo está listo y sincronizado en tu vista previa. ¿Hay algún logro o métrica que quieras afinar o estás satisfecho con esta versión?";
      const lastMsg = cvStore.chatHistory[cvStore.chatHistory.length - 1];
      if (!lastMsg || lastMsg.text !== syncText) {
        cvStore.chatHistory.push({
          id: Date.now(),
          role: 'assistant',
          text: syncText
        });
      }
    }
  }
}

async function generateFullDraftWithAI() {
  if (isAiLoading.value) return;
  try {
    isAiLoading.value = true;
    const typeKey = selectedCVType.value?.toLowerCase() || 'harvard';
    const standardObj = CV_STANDARDS[typeKey] || CV_STANDARDS.harvard;

    const payload = {
      prompt: `[COMPILACIÓN DE BORRADOR COMPLETO] Toma los siguientes datos ingresados por el usuario en el formulario y optimízalos íntegramente con la Fórmula XYZ de Google y el estándar '${standardObj.title}': ${JSON.stringify(cvStore.content)}`,
      objective: objective.value || 'Trabajo',
      targetJob: targetJob.value || 'Profesional',
      vacancyInfo: vacancyInfo.value || '',
      cvType: typeKey,
      fullSpecs: standardObj,
      finalStructure: JSON.parse(JSON.stringify(finalStructure.value)),
      history: []
    };

    const result = await apiService.optimizeCV(payload);
    if (result.updatedCVData) {
      cvStore.content = mergeObjects(cvStore.content, result.updatedCVData);
      recentlyUpdatedSection.value = 'experience';
      triggerAlert("✨ ¡Borrador completo generado e inyectado con éxito en el lienzo de vista previa!");
      setTimeout(() => {
        recentlyUpdatedSection.value = null;
      }, 4000);
    }
  } catch (error) {
    console.error("Error generando borrador con IA:", error);
    triggerAlert("Hubo un error al compilar con la IA. Se conservaron los datos del formulario.");
  } finally {
    isAiLoading.value = false;
  }
}

const MONTHS_LIST = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function updateItemDates(item) {
  if (!item) return;
  const startMonth = item.startMonth || '';
  const startYear = item.startYear || '';
  const isCurrent = item.isCurrent || false;
  const endMonth = item.endMonth || '';
  const endYear = item.endYear || '';

  const startPart = [startMonth, startYear].filter(Boolean).join(' ');
  const endPart = isCurrent ? 'Presente' : [endMonth, endYear].filter(Boolean).join(' ');

  item.startDate = startPart && endPart ? `${startPart} - ${endPart}` : (startPart || endPart || item.startDate || '');
}

function addCustomSection() {
  const newId = `custom_${Date.now()}`;
  finalStructure.value.push({
    id: newId,
    label: 'Nueva Sección Personalizada'
  });
  cvStore.structureOrder = finalStructure.value;
  triggerAlert("✨ Sección personalizada agregada a la jerarquía.");
}

function removeSection(index) {
  if (finalStructure.value.length <= 1) return;
  const removed = finalStructure.value.splice(index, 1);
  cvStore.structureOrder = finalStructure.value;
  triggerAlert(`Sección '${removed[0]?.label || ''}' eliminada.`);
}

function addExperienceItem() {
  if (!Array.isArray(cvStore.content.experience)) cvStore.content.experience = [];
  cvStore.content.experience.push({ title: '', company: '', startDate: '', startMonth: '', startYear: '', isCurrent: false, endMonth: '', endYear: '', location: '', description: [] });
}
function removeExperienceItem(index) {
  if (Array.isArray(cvStore.content.experience)) cvStore.content.experience.splice(index, 1);
}

function addProjectItem() {
  if (!Array.isArray(cvStore.content.projects)) cvStore.content.projects = [];
  cvStore.content.projects.push({ title: '', company: '', description: [], technologies: [] });
}
function removeProjectItem(index) {
  if (Array.isArray(cvStore.content.projects)) cvStore.content.projects.splice(index, 1);
}

function addEducationItem() {
  if (!Array.isArray(cvStore.content.education)) cvStore.content.education = [];
  cvStore.content.education.push({ degree: '', institution: '', startDate: '', endDate: '' });
}
function removeEducationItem(index) {
  if (Array.isArray(cvStore.content.education)) cvStore.content.education.splice(index, 1);
}

function addStackCategory() {
  if (!Array.isArray(cvStore.content.stack)) cvStore.content.stack = [];
  cvStore.content.stack.push({ category: 'Nueva Categoría', items: [] });
}
function removeStackCategory(index) {
  if (Array.isArray(cvStore.content.stack)) cvStore.content.stack.splice(index, 1);
}

function applyAIProposal(proposalData, sectionName) {
  if (!proposalData) return;
  cvStore.content = mergeObjects(cvStore.content, proposalData);
  recentlyUpdatedSection.value = sectionName || 'experience';
  triggerAlert("✨ ¡Cambio de la IA aplicado con éxito a tu formulario y vista previa!");
  setTimeout(() => {
    recentlyUpdatedSection.value = null;
  }, 4000);
}

async function optimizeSectionWithAI(sectionKey, promptText) {
  if (isAiLoading.value) return;

  // 1. Redirección Inteligente a la pestaña Chat
  step4Mode.value = 'chat';

  const typeKey = selectedCVType.value?.toLowerCase() || 'harvard';
  const standardObj = CV_STANDARDS[typeKey] || CV_STANDARDS.harvard;

  // 2. Agregamos el prompt como mensaje de usuario en el chat
  cvStore.chatHistory.push({
    id: Date.now(),
    role: 'user',
    text: `Solicitud de Optimización para '${sectionKey}': "${promptText || 'Sin contenido previo'}"`
  });

  try {
    isAiLoading.value = true;

    const payload = {
      prompt: `[OPTIMIZACIÓN DE SECCIÓN '${sectionKey}'] Refacciona y optimiza el siguiente contenido usando la Fórmula XYZ de Google e métricas cuantificables: "${promptText}".`,
      objective: objective.value || 'Trabajo',
      targetJob: targetJob.value || 'Profesional',
      vacancyInfo: vacancyInfo.value || '',
      cvType: typeKey,
      fullSpecs: standardObj,
      finalStructure: JSON.parse(JSON.stringify(finalStructure.value)),
      history: []
    };

    const result = await apiService.optimizeCV(payload);

    // 3. Renderizamos propuesta en el chat con botón [ 📥 Aplicar Cambio ]
    cvStore.chatHistory.push({
      id: Date.now() + 1,
      role: 'assistant',
      text: result.messageToUser || `He preparado una propuesta optimizada para tu sección de ${sectionKey}.`,
      proposalData: result.updatedCVData,
      sectionName: sectionKey
    });

  } catch (error) {
    console.error("Error optimizando sección:", error);
    triggerAlert("Hubo un problema optimizando la sección. Por favor intenta de nuevo.");
  } finally {
    isAiLoading.value = false;
    nextTick(() => scrollToBottom());
  }
}

onMounted(() => {
  cvStore.init();
});

// Variable de entorno
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Margen dinámico basado en el CV seleccionado
const marginValue = computed(() => {
  const standard = CV_STANDARDS[selectedCVType.value];
  if (!standard) return 20;
  const margins = standard.specs.margins;
  if (margins.includes('cm')) {
    return parseFloat(margins) * 10; // cm to mm
  } else {
    return parseFloat(margins) || 20;
  }
});
const isSaving = ref(false);
const rawOriginalContent = ref(null);

function restoreOriginalAIContent() {
  if (rawOriginalContent.value) {
    cvStore.content = JSON.parse(JSON.stringify(rawOriginalContent.value));
    triggerAlert("Se ha restablecido la versión original generada por la IA.");
  } else {
    triggerAlert("Aún no hay una versión previa respaldada.");
  }
}


const metas = ['Beca', 'Trabajo', 'Maestría'];

const fontSizeBase = ref(11); // Tamaño inicial

const increaseSize = () => { 
  if(fontSizeBase.value < 18) fontSizeBase.value++ 
};

const decreaseSize = () => { 
  if(fontSizeBase.value > 8) fontSizeBase.value-- 
};
// --- MÉTODOS DE NAVEGACIÓN Y SELECCIÓN ---
function selectMeta(meta) {
  objective.value = meta;
}
const scrollToBottom = async () => {
  // Esperamos a que Vue termine de renderizar el nuevo mensaje
  await nextTick(); 
  if (chatContainer.value) {
    chatContainer.value.scrollTo({
      top: chatContainer.value.scrollHeight,
      behavior: 'smooth' // Desplazamiento suave
    });
  }
};
watch(currentStep, (newStep) => {
  if (newStep === 4) {
    // 1. Validamos que exista el estándar seleccionado
    const standard = CV_STANDARDS[selectedCVType.value];

    if (!standard) {
      // 2. Saludo de emergencia si no hay diseño seleccionado (evita el crash)
      chatHistory.value = [{
        id: Date.now(),
        role: 'assistant',
        text: "¡Hola! Estoy listo para optimizar tu CV pero recuerda escoger que tipo de Cv quieres para tener más contexto sobre ti."
      }];
      return;
    }

    // 3. Saludo normal si todo está bien
    chatHistory.value = [{
      id: Date.now(),
      role: 'assistant',
      text: `👋 ¡Todo listo! He configurado tu estrategia basada en el estándar ${standard.title}.
                \nOptimizaré tu perfil siguiendo este orden: ${finalStructure.value.map(s => s.label).join(' → ')}.
                \n¿Empezamos a construirlo? Solo dime "Hola" o "Empezar" para analizar tus datos actuales.`
    }];
  }
});

const selectCVTypeAndNext = (type) => {
  const standard = CV_STANDARDS[type.toLowerCase()];
  if (standard) {
    cvStore.setCvType(type);
    selectedCVType.value = type;
    const newStructure = JSON.parse(JSON.stringify(standard.structure));
    finalStructure.value = newStructure;
    cvStore.structureOrder = newStructure;

    if (type.toLowerCase() === 'tech') {
      cvStore.content.stack = [
        { category: "Lenguajes de Programación", items: ["TypeScript", "JavaScript", "Python", "Go"] },
        { category: "Frameworks y Librerías", items: ["Vue.js", "React", "Node.js", "Express", "TailwindCSS"] },
        { category: "Herramientas, Cloud & DevOps", items: ["Docker", "AWS", "Git", "CI/CD", "Linux"] },
        { category: "Bases de Datos & Almacenamiento", items: ["PostgreSQL", "MongoDB", "Redis", "Supabase"] }
      ];
    }
  }
};

watch(selectedCVType, (newType) => {
  if (newType && CV_STANDARDS[newType.toLowerCase()]) {
    const standard = CV_STANDARDS[newType.toLowerCase()];
    const newStructure = JSON.parse(JSON.stringify(standard.structure));
    finalStructure.value = newStructure;
    cvStore.structureOrder = newStructure;
  }
});
function triggerAlert(msg) {
  toastMessage.value = msg;
  showErrorToast.value = true;
  
  // Se oculta sola después de 4 segundos
  setTimeout(() => {
    showErrorToast.value = false;
  }, 4000);
}
async function nextStep() {
  if (currentStep.value === 1) {
    if (!targetJob.value.trim()) {
      triggerAlert("Por favor, escribe el puesto al que aspiras para continuar.");
      return;
    }
    if (!objective.value) selectMeta('Trabajo');
    currentStep.value = 2;
    return;
  }

  if (currentStep.value === 2) {
    const selected = selectedCVType.value || 'harvard';
    selectCVTypeAndNext(selected);
    currentStep.value = 3;
    return;
  }

  if (currentStep.value === 3) {
    if (finalStructure.value.length === 0) {
      triggerAlert("No hay una estructura definida. Selecciona un estilo en el Paso 2.");
      currentStep.value = 2;
      return;
    }
    currentStep.value = 4;
    return;
  }

  if (currentStep.value === 4) {
    currentStep.value = 5;
    return;
  }

  if (currentStep.value === 5) {
    saveCV();
    return;
  }
}

function prevStep() {
  if (currentStep.value > 1) currentStep.value--;
}

// --- LÓGICA DE IA ---
async function sendMessage() {
  if (!userMessage.value.trim() || isAiLoading.value) return;

  // 1. Limpiamos el texto y preparamos el historial
  const currentInput = userMessage.value;
  const newMessage = { id: Date.now(), role: 'user', text: currentInput };
  cvStore.chatHistory.push(newMessage);
  userMessage.value = ''; 

  const cleanHistory = cvStore.chatHistory.map(m => ({
    role: m.role,
    text: m.text
  }));

  // 2. CORRECCIÓN AQUÍ: Obtenemos el tipo y las specs correctamente
  // selectedCVType es el REF, lo pasamos a minúsculas para coincidir con las llaves
  const typeKey = selectedCVType.value?.toLowerCase() || 'harvard';

  const isFirstInteraction = cvStore.chatHistory.length <= 1;

  // Buscamos el estándar completo
  const standardObj = CV_STANDARDS[typeKey] || CV_STANDARDS.harvard;

  const payload = { 
    prompt: isFirstInteraction 
            ? `[INICIO DE CONVERSACIÓN] El usuario dice: "${currentInput}". 
               Salúdalo con mucho carisma como por ejemplo: (Un gusto tenerte aquí, etc...), preséntate como Craft.ai 
               y menciónale que estás listo para optimizar su CV con el estándar ${typeKey}.` 
            : currentInput,
    objective: objective.value || 'Trabajo',
    targetJob: targetJob.value || 'Profesional',
    vacancyInfo: vacancyInfo.value || '',
    cvType: typeKey,
    fullSpecs: standardObj, // Enviamos el objeto estándar completo
    finalStructure: JSON.parse(JSON.stringify(finalStructure.value)), 
    history: cleanHistory
  };

  try {
    isAiLoading.value = true;
    const result = await apiService.optimizeCV(payload);

    cvStore.chatHistory.push({ 
      id: Date.now() + 1, 
      role: 'assistant', 
      text: result.messageToUser || 'CV optimizado correctamente.'
    });
    
    if (result.updatedCVData) {
        cvStore.content = mergeObjects(cvStore.content, result.updatedCVData);
        rawOriginalContent.value = JSON.parse(JSON.stringify(cvStore.content));
        
        const secToHighlight = result.currentSection || Object.keys(result.updatedCVData)[0] || 'experience';
        recentlyUpdatedSection.value = secToHighlight;
        setTimeout(() => {
          recentlyUpdatedSection.value = null;
        }, 4000);
    }

  } catch (error) {
    console.error('Error detallado:', error);
    if (error.message.includes('500')) {
     triggerAlert(" El servidor de IA está saturado. Espera 30 segundos e intenta de nuevo.");
    }
    cvStore.chatHistory.push({ 
      id: Date.now(), 
      role: 'assistant', 
      text: "Hubo un problema al conectar con el servidor. ¿Podemos reintentar?" 
    });
  } finally {
    isAiLoading.value = false;
    nextTick(() => scrollToBottom());
  }
}

// Función auxiliar para no sobrescribir con vacíos
function mergeObjects(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      target[key] = { ...target[key], ...source[key] };
    } else if (Array.isArray(source[key]) && source[key].length > 0) {
      target[key] = source[key];
    } else if (source[key] !== "" && source[key] !== null) {
      target[key] = source[key];
    }
  }
  return target;
}

// --- ACCIONES FINALES ---
const downloadPDF = async () => {
  const originalElement = document.getElementById('cv-printable-area');
  if (!originalElement) return;

  const standard = CV_STANDARDS[selectedCVType.value.toLowerCase()] || CV_STANDARDS.harvard;
  const cssMargin = standard.specs.margins || '20mm';

  // 1. Aislamiento A4 Estricto: contenedor fuera de pantalla sin desalineación flexbox
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'fixed';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '0';
  tempContainer.style.width = '210mm';
  tempContainer.style.margin = '0';
  tempContainer.style.padding = '0';
  tempContainer.style.transform = 'none';
  tempContainer.style.background = '#ffffff';

  // 2. Clonamos el elemento original con los cambios WYSIWYG
  const clone = originalElement.cloneNode(true);
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.padding = cssMargin;
  clone.style.width = '210mm';
  clone.style.boxSizing = 'border-box';
  clone.style.textAlign = 'left';

  tempContainer.appendChild(clone);
  document.body.appendChild(tempContainer);

  const opt = {
    margin: 0,
    filename: `CV_${cvStore.content?.personalInfo?.fullName || 'Profesional'}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { 
      scale: 4, 
      useCORS: true, 
      letterRendering: true,
      scrollY: 0,
      scrollX: 0,
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  try {
    await html2pdf().set(opt).from(clone).save();
    triggerAlert("✨ ¡CV exportado exitosamente en PDF de Alta Resolución!");
  } catch (err) {
    console.error("Error al exportar PDF:", err);
    triggerAlert("Hubo un problema al generar el PDF.");
  } finally {
    document.body.removeChild(tempContainer);
  }
};

async function saveCV(asNew = false) {
  if (isSaving.value) return;
  
  isSaving.value = true;
  try {
    const payload = {
      userId: authStore.user?.id,
      // Si asNew es true, no enviamos ID para que el backend cree un registro nuevo
      cvId: asNew ? null : cvStore.currentCvId, 
      cvData: cvStore.content, 
      // Si es nuevo, le ponemos un nombre distinto para no confundirnos
      title: asNew 
        ? `${targetJob.value} (Copia ${new Date().toLocaleDateString()})` 
        : (targetJob.value || "Mi CV"),
      cvType: cvStore.cvType,
      objectiveType: objective.value?.toLowerCase() || 'trabajo',
      vacancyInfo: vacancyInfo.value,
      // Guardamos también el historial para que la IA lo recupere luego
      chatHistory: cvStore.chatHistory 
    };

    const result = await apiService.saveCV(payload);
    const savedData = result.data || result;

    if (savedData?.id) cvStore.currentCvId = savedData.id;

    toastMessage.value = asNew ? "¡Nueva versión creada!" : "¡Cambios guardados!";
    showErrorToast.value = false;
    
    if (asNew) {
      setTimeout(() => router.push('/dashboard'), 1500);
    }
  } catch (err) {
    console.error("Error al guardar:", err);
    toastMessage.value = err.message || "Error al conectar con el servidor";
    showErrorToast.value = true;
  } finally {
    isSaving.value = false;
  }
}

</script>


<style scoped>
.step-container {
  transition: all 0.3s ease;
}

@keyframes blob {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(20px, -20px) scale(1.05);
  }
  66% {
    transform: translate(-25px, 20px) scale(0.95);
  }
}

.animate-blob {
  animation: blob 12s ease-in-out infinite;
}

.delay-2000 {
  animation-delay: 2s;
}

.delay-4000 {
  animation-delay: 4s;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
/* Animación de la Alerta (Toast) */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, -100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -50px) scale(0.9);
}
/* Scrollbar elegante para el Chat */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.4); /* Color Esmeralda */
}

/* Scrollbar ultra-fina para la Vista Previa lateral */
.custom-scrollbar-mini::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar-mini::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
}

/* Efecto de entrada suave */
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
/* Scrollbar elegante para el Chat */
.custom-scrollbar-mini::-webkit-scrollbar,
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.custom-scrollbar-mini::-webkit-scrollbar-track,
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent !important;
}
.custom-scrollbar-mini::-webkit-scrollbar-thumb,
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.35) !important; /* Plomo/Slate sutil */
  border-radius: 9999px;
}
.custom-scrollbar-mini::-webkit-scrollbar-thumb:hover,
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.65) !important;
}
/* Dentro de tu CSS de la vista previa */
.cv-content-text {
  text-align: left; /* Alineado a la izquierda para lectura profesional */
  text-wrap: pretty; /* Evita palabras huérfanas al final */
  line-height: 1.5; /* Espaciado cómodo */
  width: 100%;
}

/* Para las listas de trabajo (Experiencia) */
.cv-list {
  list-style-type: disc; /* Viñeta de punto */
  margin-left: 1.25rem; /* Sangría para que el punto no se salga */
  text-align: justify; /* Esto hace que el texto llene los costados por igual */
}

/* Aseguramos que el contenido dentro de la hoja se escriba a la izquierda */
:deep(.cv-section-text), 
:deep(.cv-section-title) {
  text-align: left !important;
}

:deep(.cv-paper) {
  margin: 0 auto; /* Centra la hoja dentro del cristal */
}
.custom-ctrl-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 300;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.custom-ctrl-btn:hover {
  background: rgba(71, 141, 118, 0.5); /* El verde esmeralda de tu app */
  transform: scale(1.1) translateX(5px);
  border-color: rgba(255, 255, 255, 0.5);
}

.a4-sheet {
  pointer-events: all !important;
  user-select: text !important;
  -webkit-user-select: text !important;
  position: relative;
  z-index: 9999 !important; /* Máxima prioridad */
}
.main-editable-container {
  cursor: text !important;
  pointer-events: auto !important;
}
.step-5-container { 
  pointer-events: none; 
}

.step-5-container > * { 
  pointer-events: auto; 
}
</style>