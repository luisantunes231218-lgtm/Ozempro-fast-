"use client"

import { useState, useEffect } from 'react'
import { 
  Home, Calendar, TrendingUp, User, 
  Droplet, Scale, ChevronRight, Plus, X,
  Syringe, Clock, Target, Award
} from 'lucide-react'

// Types
interface UserProfile {
  name: string
  weight: number
  targetWeight: number
  height: number
  medication: string
  dosage: string
  frequency: string
  startDate: string
}

interface WeightEntry {
  id: string
  date: string
  weight: number
  notes?: string
}

interface InjectionLog {
  id: string
  date: string
  time: string
  dosage: string
  location: string
  notes?: string
}

interface SideEffect {
  id: string
  date: string
  type: string
  severity: 'low' | 'medium' | 'high'
  notes?: string
}

export default function OzemproApp() {
  const [hasProfile, setHasProfile] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [activeTab, setActiveTab] = useState<'home' | 'progress' | 'injection' | 'profile'>('home')
  
  // Data states
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([])
  const [injectionLogs, setInjectionLogs] = useState<InjectionLog[]>([])
  const [sideEffects, setSideEffects] = useState<SideEffect[]>([])
  
  // Modal states
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showAddWeight, setShowAddWeight] = useState(false)
  const [showAddInjection, setShowAddInjection] = useState(false)
  const [showAddSideEffect, setShowAddSideEffect] = useState(false)
  
  // Onboarding step
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState<Partial<UserProfile>>({})

  // Check if user has profile
  useEffect(() => {
    const savedProfile = localStorage.getItem('ozempro_profile')
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      setUserProfile(profile)
      setHasProfile(true)
    } else {
      setShowOnboarding(true)
    }
  }, [])

  // Load data from localStorage
  useEffect(() => {
    if (hasProfile) {
      const savedWeight = localStorage.getItem('ozempro_weight')
      const savedInjections = localStorage.getItem('ozempro_injections')
      const savedSideEffects = localStorage.getItem('ozempro_sideeffects')
      
      if (savedWeight) setWeightHistory(JSON.parse(savedWeight))
      if (savedInjections) setInjectionLogs(JSON.parse(savedInjections))
      if (savedSideEffects) setSideEffects(JSON.parse(savedSideEffects))
    }
  }, [hasProfile])

  // Save to localStorage
  useEffect(() => {
    if (hasProfile) {
      localStorage.setItem('ozempro_weight', JSON.stringify(weightHistory))
    }
  }, [weightHistory, hasProfile])

  useEffect(() => {
    if (hasProfile) {
      localStorage.setItem('ozempro_injections', JSON.stringify(injectionLogs))
    }
  }, [injectionLogs, hasProfile])

  useEffect(() => {
    if (hasProfile) {
      localStorage.setItem('ozempro_sideeffects', JSON.stringify(sideEffects))
    }
  }, [sideEffects, hasProfile])

  // Onboarding questions
  const onboardingQuestions = [
    {
      id: 'name',
      question: 'Qual é o seu nome?',
      type: 'text',
      placeholder: 'Digite seu nome',
    },
    {
      id: 'medication',
      question: 'Qual medicamento você está usando?',
      type: 'select',
      options: [
        'Ozempic (Semaglutida)',
        'Saxenda (Liraglutida)',
        'Wegovy (Semaglutida)',
        'Victoza (Liraglutida)',
        'Mounjaro (Tirzepatida)',
      ],
    },
    {
      id: 'dosage',
      question: 'Qual a dosagem atual?',
      type: 'text',
      placeholder: 'Ex: 0.5mg, 1.0mg',
    },
    {
      id: 'frequency',
      question: 'Com que frequência você aplica?',
      type: 'select',
      options: ['Diariamente', 'Semanalmente', 'Quinzenalmente'],
    },
    {
      id: 'weight',
      question: 'Qual seu peso atual? (kg)',
      type: 'number',
      placeholder: '75',
    },
    {
      id: 'targetWeight',
      question: 'Qual sua meta de peso? (kg)',
      type: 'number',
      placeholder: '65',
    },
    {
      id: 'height',
      question: 'Qual sua altura? (cm)',
      type: 'number',
      placeholder: '170',
    },
  ]

  // Handle onboarding
  const handleOnboardingNext = (value: string | number) => {
    const currentQuestion = onboardingQuestions[onboardingStep]
    setOnboardingData({ ...onboardingData, [currentQuestion.id]: value })

    if (onboardingStep < onboardingQuestions.length - 1) {
      setOnboardingStep(onboardingStep + 1)
    } else {
      // Complete onboarding
      const profile: UserProfile = {
        name: onboardingData.name as string,
        weight: onboardingData.weight as number,
        targetWeight: onboardingData.targetWeight as number,
        height: onboardingData.height as number,
        medication: onboardingData.medication as string,
        dosage: onboardingData.dosage as string,
        frequency: onboardingData.frequency as string,
        startDate: new Date().toISOString(),
      }
      
      localStorage.setItem('ozempro_profile', JSON.stringify(profile))
      setUserProfile(profile)
      setHasProfile(true)
      setShowOnboarding(false)
      
      // Add initial weight entry
      const initialWeight: WeightEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        weight: profile.weight,
        notes: 'Peso inicial',
      }
      setWeightHistory([initialWeight])
    }
  }

  // Add weight entry
  const addWeightEntry = (weight: number, notes?: string) => {
    const entry: WeightEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      weight,
      notes,
    }
    setWeightHistory([...weightHistory, entry])
    setShowAddWeight(false)
  }

  // Add injection log
  const addInjectionLog = (dosage: string, location: string, notes?: string) => {
    const log: InjectionLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      dosage,
      location,
      notes,
    }
    setInjectionLogs([...injectionLogs, log])
    setShowAddInjection(false)
  }

  // Add side effect
  const addSideEffect = (type: string, severity: 'low' | 'medium' | 'high', notes?: string) => {
    const effect: SideEffect = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      type,
      severity,
      notes,
    }
    setSideEffects([...sideEffects, effect])
    setShowAddSideEffect(false)
  }

  // Calculate stats
  const currentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : userProfile?.weight || 0
  const weightLost = userProfile ? userProfile.weight - currentWeight : 0
  const weightToGo = userProfile ? currentWeight - userProfile.targetWeight : 0
  const progressPercentage = userProfile ? ((userProfile.weight - currentWeight) / (userProfile.weight - userProfile.targetWeight)) * 100 : 0
  const bmi = userProfile ? (currentWeight / Math.pow(userProfile.height / 100, 2)).toFixed(1) : 0
  const daysOnTreatment = userProfile ? Math.floor((Date.now() - new Date(userProfile.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0

  // Get next injection date
  const getNextInjectionDate = () => {
    if (!userProfile || injectionLogs.length === 0) return 'Registre sua primeira aplicação'
    
    const lastInjection = injectionLogs[injectionLogs.length - 1]
    const lastDate = new Date(lastInjection.date.split('/').reverse().join('-'))
    
    let daysToAdd = 1
    if (userProfile.frequency === 'Semanalmente') daysToAdd = 7
    if (userProfile.frequency === 'Quinzenalmente') daysToAdd = 14
    
    const nextDate = new Date(lastDate)
    nextDate.setDate(nextDate.getDate() + daysToAdd)
    
    const today = new Date()
    const diffTime = nextDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Aplicação atrasada!'
    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Amanhã'
    return `Em ${diffDays} dias`
  }

  // Onboarding screen
  if (showOnboarding) {
    const currentQuestion = onboardingQuestions[onboardingStep]
    
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#4A90E2] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Droplet className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">Ozempro</h1>
            <p className="text-[#7F8C8D]">Seu companheiro de tratamento</p>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8ECEF]">
            <div className="mb-8">
              <div className="flex justify-between text-sm text-[#7F8C8D] mb-2">
                <span>Passo {onboardingStep + 1} de {onboardingQuestions.length}</span>
                <span>{Math.round(((onboardingStep + 1) / onboardingQuestions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-[#E8ECEF] rounded-full h-2">
                <div
                  className="bg-[#4A90E2] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((onboardingStep + 1) / onboardingQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">
              {currentQuestion.question}
            </h2>

            {currentQuestion.type === 'text' || currentQuestion.type === 'number' ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const input = e.currentTarget.elements.namedItem('answer') as HTMLInputElement
                  if (input.value.trim()) {
                    handleOnboardingNext(currentQuestion.type === 'number' ? Number(input.value) : input.value.trim())
                  }
                }}
                className="space-y-4"
              >
                <input
                  type={currentQuestion.type}
                  name="answer"
                  required
                  autoFocus
                  className="w-full px-6 py-4 border border-[#E8ECEF] rounded-xl focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent text-lg"
                  placeholder={currentQuestion.placeholder}
                />
                <button
                  type="submit"
                  className="w-full bg-[#4A90E2] text-white py-4 rounded-xl font-semibold hover:bg-[#357ABD] transition-colors flex items-center justify-center gap-2"
                >
                  {onboardingStep < onboardingQuestions.length - 1 ? 'Continuar' : 'Finalizar'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOnboardingNext(option)}
                    className="w-full text-left p-5 bg-[#F8FAFB] hover:bg-[#E8ECEF] rounded-xl border border-[#E8ECEF] transition-colors flex items-center justify-between group"
                  >
                    <span className="font-medium text-[#2C3E50] text-lg">
                      {option}
                    </span>
                    <ChevronRight className="w-6 h-6 text-[#7F8C8D] group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            )}

            {onboardingStep > 0 && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setOnboardingStep(onboardingStep - 1)}
                  className="text-[#7F8C8D] hover:text-[#2C3E50] text-sm"
                >
                  ← Voltar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Header */}
      <header className="bg-white border-b border-[#E8ECEF] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4A90E2] rounded-full flex items-center justify-center">
                <Droplet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#2C3E50]">Ozempro</h1>
                <p className="text-xs text-[#7F8C8D]">Olá, {userProfile?.name}!</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 pb-24">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Hero Card - Weight Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECEF]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[#7F8C8D] text-sm mb-1">Peso Atual</p>
                  <h2 className="text-4xl font-bold text-[#2C3E50]">{currentWeight.toFixed(1)} kg</h2>
                </div>
                <div className="w-14 h-14 bg-[#E8F4FD] rounded-full flex items-center justify-center">
                  <Scale className="w-7 h-7 text-[#4A90E2]" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-[#F8FAFB] rounded-xl p-3 text-center">
                  <p className="text-[#7F8C8D] text-xs mb-1">Perdidos</p>
                  <p className="text-xl font-bold text-[#27AE60]">{weightLost.toFixed(1)} kg</p>
                </div>
                <div className="bg-[#F8FAFB] rounded-xl p-3 text-center">
                  <p className="text-[#7F8C8D] text-xs mb-1">Faltam</p>
                  <p className="text-xl font-bold text-[#E67E22]">{weightToGo.toFixed(1)} kg</p>
                </div>
                <div className="bg-[#F8FAFB] rounded-xl p-3 text-center">
                  <p className="text-[#7F8C8D] text-xs mb-1">IMC</p>
                  <p className="text-xl font-bold text-[#4A90E2]">{bmi}</p>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm mb-2 text-[#7F8C8D]">
                  <span>Progresso para meta</span>
                  <span className="font-semibold text-[#4A90E2]">{Math.min(progressPercentage, 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-[#E8ECEF] rounded-full h-2.5">
                  <div
                    className="bg-[#4A90E2] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Next Injection Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8ECEF]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E8F4FD] rounded-full flex items-center justify-center">
                    <Syringe className="w-5 h-5 text-[#4A90E2]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2C3E50]">Próxima Aplicação</h3>
                    <p className="text-sm text-[#7F8C8D]">{userProfile?.medication}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddInjection(true)}
                  className="bg-[#4A90E2] text-white p-2.5 rounded-lg hover:bg-[#357ABD] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-[#F8FAFB] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#4A90E2]" />
                    <span className="font-semibold text-[#2C3E50]">{getNextInjectionDate()}</span>
                  </div>
                  <span className="text-sm text-[#7F8C8D]">{userProfile?.dosage}</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8ECEF]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E8F4FD] rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#4A90E2]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#7F8C8D]">Dias em tratamento</p>
                    <p className="text-2xl font-bold text-[#2C3E50]">{daysOnTreatment}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8ECEF]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E8F4FD] rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-[#4A90E2]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#7F8C8D]">Aplicações</p>
                    <p className="text-2xl font-bold text-[#2C3E50]">{injectionLogs.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8ECEF]">
              <h3 className="font-semibold text-[#2C3E50] mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowAddWeight(true)}
                  className="bg-[#F8FAFB] border border-[#E8ECEF] rounded-xl p-4 hover:bg-[#E8ECEF] transition-colors"
                >
                  <Scale className="w-6 h-6 text-[#4A90E2] mb-2" />
                  <p className="font-semibold text-[#2C3E50] text-sm">Registrar Peso</p>
                </button>

                <button
                  onClick={() => setShowAddSideEffect(true)}
                  className="bg-[#F8FAFB] border border-[#E8ECEF] rounded-xl p-4 hover:bg-[#E8ECEF] transition-colors"
                >
                  <Droplet className="w-6 h-6 text-[#4A90E2] mb-2" />
                  <p className="font-semibold text-[#2C3E50] text-sm">Efeito Colateral</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#2C3E50]">Meu Progresso</h2>
              <button
                onClick={() => setShowAddWeight(true)}
                className="bg-[#4A90E2] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#357ABD] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Adicionar
              </button>
            </div>

            {/* Weight Chart Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECEF]">
              <h3 className="font-semibold text-[#2C3E50] mb-4">Evolução do Peso</h3>
              
              {weightHistory.length > 0 ? (
                <div className="space-y-4">
                  {/* Simple visual chart */}
                  <div className="relative h-48 bg-[#F8FAFB] rounded-xl p-4 overflow-hidden">
                    <div className="absolute inset-0 flex items-end justify-around p-4">
                      {weightHistory.slice(-7).map((entry, index) => {
                        const maxWeight = Math.max(...weightHistory.map(e => e.weight))
                        const minWeight = Math.min(...weightHistory.map(e => e.weight))
                        const range = maxWeight - minWeight || 1
                        const heightPercent = ((entry.weight - minWeight) / range) * 70 + 20
                        
                        return (
                          <div key={entry.id} className="flex flex-col items-center gap-2 flex-1">
                            <div className="text-xs font-semibold text-[#4A90E2]">{entry.weight}kg</div>
                            <div
                              className="w-full bg-[#4A90E2] rounded-t-lg transition-all duration-500"
                              style={{ height: `${heightPercent}%` }}
                            />
                            <div className="text-xs text-[#7F8C8D]">
                              {new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Weight History List */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#2C3E50] text-sm">Histórico</h4>
                    {weightHistory.slice().reverse().map(entry => (
                      <div key={entry.id} className="flex items-center justify-between p-4 bg-[#F8FAFB] rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#E8F4FD] rounded-full flex items-center justify-center">
                            <Scale className="w-5 h-5 text-[#4A90E2]" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#2C3E50]">{entry.weight} kg</p>
                            <p className="text-xs text-[#7F8C8D]">
                              {new Date(entry.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        {entry.notes && (
                          <p className="text-xs text-[#7F8C8D] italic">{entry.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Scale className="w-16 h-16 text-[#E8ECEF] mx-auto mb-4" />
                  <p className="text-[#7F8C8D]">Nenhum registro de peso ainda</p>
                  <p className="text-[#7F8C8D] text-sm mt-2">Comece registrando seu peso!</p>
                </div>
              )}
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECEF]">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6 text-[#4A90E2]" />
                <h3 className="font-semibold text-[#2C3E50]">Conquistas</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className={`p-3 rounded-xl text-center border ${weightLost >= 1 ? 'bg-[#E8F4FD] border-[#4A90E2]' : 'bg-[#F8FAFB] border-[#E8ECEF]'}`}>
                  <p className="text-2xl mb-1">🎯</p>
                  <p className="text-xs font-semibold text-[#2C3E50]">Primeiro Kg</p>
                </div>
                <div className={`p-3 rounded-xl text-center border ${daysOnTreatment >= 7 ? 'bg-[#E8F4FD] border-[#4A90E2]' : 'bg-[#F8FAFB] border-[#E8ECEF]'}`}>
                  <p className="text-2xl mb-1">📅</p>
                  <p className="text-xs font-semibold text-[#2C3E50]">1 Semana</p>
                </div>
                <div className={`p-3 rounded-xl text-center border ${weightLost >= 5 ? 'bg-[#E8F4FD] border-[#4A90E2]' : 'bg-[#F8FAFB] border-[#E8ECEF]'}`}>
                  <p className="text-2xl mb-1">🏆</p>
                  <p className="text-xs font-semibold text-[#2C3E50]">5 Kg Perdidos</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Injection Tab */}
        {activeTab === 'injection' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#2C3E50]">Aplicações</h2>
              <button
                onClick={() => setShowAddInjection(true)}
                className="bg-[#4A90E2] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#357ABD] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Registrar
              </button>
            </div>

            {/* Medication Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECEF]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#E8F4FD] rounded-full flex items-center justify-center">
                  <Syringe className="w-6 h-6 text-[#4A90E2]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#2C3E50]">{userProfile?.medication}</h3>
                  <p className="text-[#7F8C8D] text-sm">Dosagem: {userProfile?.dosage}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F8FAFB] rounded-xl p-3">
                  <p className="text-[#7F8C8D] text-xs mb-1">Frequência</p>
                  <p className="font-semibold text-[#2C3E50]">{userProfile?.frequency}</p>
                </div>
                <div className="bg-[#F8FAFB] rounded-xl p-3">
                  <p className="text-[#7F8C8D] text-xs mb-1">Total de Aplicações</p>
                  <p className="font-semibold text-[#2C3E50]">{injectionLogs.length}</p>
                </div>
              </div>
            </div>

            {/* Injection Logs */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECEF]">
              <h3 className="font-semibold text-[#2C3E50] mb-4">Histórico de Aplicações</h3>

              {injectionLogs.length === 0 ? (
                <div className="text-center py-12">
                  <Syringe className="w-16 h-16 text-[#E8ECEF] mx-auto mb-4" />
                  <p className="text-[#7F8C8D]">Nenhuma aplicação registrada</p>
                  <p className="text-[#7F8C8D] text-sm mt-2">Registre sua primeira aplicação!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {injectionLogs.slice().reverse().map(log => (
                    <div key={log.id} className="flex items-start justify-between p-4 bg-[#F8FAFB] rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#E8F4FD] rounded-full flex items-center justify-center flex-shrink-0">
                          <Syringe className="w-5 h-5 text-[#4A90E2]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-[#2C3E50]">{log.dosage}</p>
                            <span className="text-xs bg-[#E8F4FD] text-[#4A90E2] px-2 py-0.5 rounded-full">
                              {log.location}
                            </span>
                          </div>
                          <p className="text-sm text-[#7F8C8D]">{log.date} às {log.time}</p>
                          {log.notes && (
                            <p className="text-sm text-[#7F8C8D] italic mt-1">{log.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Side Effects */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECEF]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#2C3E50]">Efeitos Colaterais</h3>
                <button
                  onClick={() => setShowAddSideEffect(true)}
                  className="text-[#4A90E2] hover:text-[#357ABD] text-sm font-medium"
                >
                  + Adicionar
                </button>
              </div>

              {sideEffects.length === 0 ? (
                <p className="text-[#7F8C8D] text-sm text-center py-4">Nenhum efeito colateral registrado</p>
              ) : (
                <div className="space-y-2">
                  {sideEffects.slice().reverse().slice(0, 5).map(effect => (
                    <div key={effect.id} className="flex items-center justify-between p-3 bg-[#F8FAFB] rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          effect.severity === 'high' ? 'bg-[#E74C3C]' :
                          effect.severity === 'medium' ? 'bg-[#F39C12]' :
                          'bg-[#27AE60]'
                        }`} />
                        <span className="text-sm font-medium text-[#2C3E50]">{effect.type}</span>
                      </div>
                      <span className="text-xs text-[#7F8C8D]">{effect.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#2C3E50]">Meu Perfil</h2>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8ECEF]">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[#E8F4FD] rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-[#4A90E2]" />
                </div>
                <h3 className="text-2xl font-bold text-[#2C3E50] mb-1">{userProfile?.name}</h3>
                <p className="text-[#7F8C8D] text-sm">
                  Membro desde {new Date(userProfile?.startDate || '').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-[#F8FAFB] rounded-xl p-4">
                  <p className="text-sm font-medium text-[#7F8C8D] mb-1">Medicamento</p>
                  <p className="font-semibold text-[#4A90E2]">{userProfile?.medication}</p>
                </div>
                <div className="bg-[#F8FAFB] rounded-xl p-4">
                  <p className="text-sm font-medium text-[#7F8C8D] mb-1">Dosagem Atual</p>
                  <p className="font-semibold text-[#4A90E2]">{userProfile?.dosage}</p>
                </div>
                <div className="bg-[#F8FAFB] rounded-xl p-4">
                  <p className="text-sm font-medium text-[#7F8C8D] mb-1">Frequência</p>
                  <p className="font-semibold text-[#4A90E2]">{userProfile?.frequency}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#F8FAFB] rounded-xl p-4">
                    <p className="text-sm font-medium text-[#7F8C8D] mb-1">Altura</p>
                    <p className="font-semibold text-[#4A90E2]">{userProfile?.height} cm</p>
                  </div>
                  <div className="bg-[#F8FAFB] rounded-xl p-4">
                    <p className="text-sm font-medium text-[#7F8C8D] mb-1">Peso Inicial</p>
                    <p className="font-semibold text-[#4A90E2]">{userProfile?.weight} kg</p>
                  </div>
                  <div className="bg-[#F8FAFB] rounded-xl p-4">
                    <p className="text-sm font-medium text-[#7F8C8D] mb-1">Meta</p>
                    <p className="font-semibold text-[#4A90E2]">{userProfile?.targetWeight} kg</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECEF]">
              <h3 className="font-semibold text-[#2C3E50] mb-4">Configurações</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-4 bg-[#F8FAFB] hover:bg-[#E8ECEF] rounded-xl transition-colors flex items-center justify-between">
                  <span className="font-medium text-[#2C3E50]">Notificações</span>
                  <ChevronRight className="w-5 h-5 text-[#7F8C8D]" />
                </button>
                <button className="w-full text-left p-4 bg-[#F8FAFB] hover:bg-[#E8ECEF] rounded-xl transition-colors flex items-center justify-between">
                  <span className="font-medium text-[#2C3E50]">Lembretes de Aplicação</span>
                  <ChevronRight className="w-5 h-5 text-[#7F8C8D]" />
                </button>
                <button className="w-full text-left p-4 bg-[#F8FAFB] hover:bg-[#E8ECEF] rounded-xl transition-colors flex items-center justify-between">
                  <span className="font-medium text-[#2C3E50]">Exportar Dados</span>
                  <ChevronRight className="w-5 h-5 text-[#7F8C8D]" />
                </button>
              </div>
            </div>

            {/* Reset Profile */}
            <button
              onClick={() => {
                if (confirm('Tem certeza que deseja redefinir seu perfil? Todos os dados serão perdidos.')) {
                  localStorage.clear()
                  window.location.reload()
                }
              }}
              className="w-full bg-[#FEF5F5] text-[#E74C3C] py-4 rounded-xl font-semibold hover:bg-[#FADBD8] transition-colors"
            >
              Redefinir Perfil
            </button>
          </div>
        )}
      </main>

      {/* Add Weight Modal */}
      {showAddWeight && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C3E50]">Registrar Peso</h3>
              <button
                onClick={() => setShowAddWeight(false)}
                className="text-[#7F8C8D] hover:text-[#2C3E50]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                addWeightEntry(
                  Number(formData.get('weight')),
                  formData.get('notes') as string
                )
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2">Peso (kg)</label>
                <input
                  type="number"
                  name="weight"
                  required
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-3 border border-[#E8ECEF] rounded-xl focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent text-lg"
                  placeholder="75.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2">Observações (opcional)</label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-4 py-3 border border-[#E8ECEF] rounded-xl focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent resize-none"
                  placeholder="Ex: Pesagem em jejum"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#4A90E2] text-white py-4 rounded-xl font-semibold hover:bg-[#357ABD] transition-colors"
              >
                Registrar Peso
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Injection Modal */}
      {showAddInjection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C3E50]">Registrar Aplicação</h3>
              <button
                onClick={() => setShowAddInjection(false)}
                className="text-[#7F8C8D] hover:text-[#2C3E50]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                addInjectionLog(
                  formData.get('dosage') as string,
                  formData.get('location') as string,
                  formData.get('notes') as string
                )
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2">Dosagem</label>
                <input
                  type="text"
                  name="dosage"
                  required
                  defaultValue={userProfile?.dosage}
                  className="w-full px-4 py-3 border border-[#E8ECEF] rounded-xl focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                  placeholder="Ex: 0.5mg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2">Local da Aplicação</label>
                <select
                  name="location"
                  required
                  className="w-full px-4 py-3 border border-[#E8ECEF] rounded-xl focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                >
                  <option value="Abdômen">Abdômen</option>
                  <option value="Coxa">Coxa</option>
                  <option value="Braço">Braço</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2">Observações (opcional)</label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-4 py-3 border border-[#E8ECEF] rounded-xl focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent resize-none"
                  placeholder="Ex: Sem efeitos colaterais"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#4A90E2] text-white py-4 rounded-xl font-semibold hover:bg-[#357ABD] transition-colors"
              >
                Registrar Aplicação
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Side Effect Modal */}
      {showAddSideEffect && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C3E50]">Registrar Efeito Colateral</h3>
              <button
                onClick={() => setShowAddSideEffect(false)}
                className="text-[#7F8C8D] hover:text-[#2C3E50]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                addSideEffect(
                  formData.get('type') as string,
                  formData.get('severity') as 'low' | 'medium' | 'high',
                  formData.get('notes') as string
                )
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2">Tipo</label>
                <select
                  name="type"
                  required
                  className="w-full px-4 py-3 border border-[#E8ECEF] rounded-xl focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                >
                  <option value="Náusea">Náusea</option>
                  <option value="Vômito">Vômito</option>
                  <option value="Diarreia">Diarreia</option>
                  <option value="Constipação">Constipação</option>
                  <option value="Dor de cabeça">Dor de cabeça</option>
                  <option value="Fadiga">Fadiga</option>
                  <option value="Tontura">Tontura</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2">Intensidade</label>
                <select
                  name="severity"
                  required
                  className="w-full px-4 py-3 border border-[#E8ECEF] rounded-xl focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                >
                  <option value="low">Leve</option>
                  <option value="medium">Moderado</option>
                  <option value="high">Grave</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2">Observações (opcional)</label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-4 py-3 border border-[#E8ECEF] rounded-xl focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent resize-none"
                  placeholder="Descreva o que sentiu..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#4A90E2] text-white py-4 rounded-xl font-semibold hover:bg-[#357ABD] transition-colors"
              >
                Registrar Efeito
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8ECEF] z-50">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'home'
                  ? 'text-[#4A90E2] bg-[#E8F4FD]'
                  : 'text-[#7F8C8D] hover:text-[#4A90E2]'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Início</span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'progress'
                  ? 'text-[#4A90E2] bg-[#E8F4FD]'
                  : 'text-[#7F8C8D] hover:text-[#4A90E2]'
              }`}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-medium">Progresso</span>
            </button>

            <button
              onClick={() => setActiveTab('injection')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'injection'
                  ? 'text-[#4A90E2] bg-[#E8F4FD]'
                  : 'text-[#7F8C8D] hover:text-[#4A90E2]'
              }`}
            >
              <Syringe className="w-6 h-6" />
              <span className="text-xs font-medium">Aplicações</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'profile'
                  ? 'text-[#4A90E2] bg-[#E8F4FD]'
                  : 'text-[#7F8C8D] hover:text-[#4A90E2]'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Perfil</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
