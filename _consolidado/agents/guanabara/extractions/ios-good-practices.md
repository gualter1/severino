# EXTRAÇÃO — ios-good-practices — Guanabara

## METADADOS
- **Repositório**: `ios-good-practices`
- **Lead Responsável**: `guanabara`
- **Funcionário (Subagente)**: `guanabara-batch1-ios`
- **Data**: `2026-10-08`
- **Tempo gasto**: `0h 30min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | "Living document" de boas práticas iOS da Futurice — ajudar quem está dando os primeiros passos em Cocoaland ou quer fazer "do jeito certo". Assume que tudo são sugestões, não dogmas. (`README.md:4`, `README.md:11-13`) |
| **Público-alvo** | Devs iOS iniciantes → sêniores, designers que tocam UI, tech leads que precisam de decision records de projeto iOS |
| **Tamanho** | 2 arquivos: `README.md` (703 linhas, ~15 seções temáticas) + `LICENSE` (CC BY 4.0). Zero código-fonte. Estrutura puramente documental. |
| **Linguagens/Tech** | Markdown + snippets Swift / Objective-C, ecossistema 2015-2017: Xcode, CocoaPods/Carthage, MVCS/MVVM/VIPER, ReactiveCocoa, AFNetworking/Alamofire, Mantle/SwiftyJSON/Argo, Auto Layout (Masonry/SnapKit, Cartography), Instruments, TestFlight, App Store Connect |
| **Freshness** | ⚠️ **Congelado / Legacy**. Última atualização relevante pré-2017 (referências a iOS 8/9, Xcode 8, Swift 2/3, Fabric/HockeyApp, 3D Touch, Xcode `.xcworkspace` obrigatório). Issues fechados, repo arquivado na prática. Muita relevância **conceitual** permanece, mas tooling está desatualizado (SPM, SwiftUI, Combine/async-await, Xcode 15+, TestFlight nativo não aparecem). |

---

## 2. O QUE PRESTA PARA **GUANABARA** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|-------------------------------|------|--------------------------------------|------------|
| Code vs Storyboards vs Híbrido — trade-offs ensináveis | `README.md:51-73` | Decision record + Analogy | `agents/guanabara/analogies/uicode-vs-storyboard.md` + `agents/guanabara/decision-records/ios-ui-approach.md` | 🔴 Alta |
| `.gitignore` curado para Swift/ObjC | `README.md:74-79` | Template + Checklist | `agents/guanabara/templates/ios-gitignore.md` | 🟢 Baixa |
| CocoaPods vs Carthage — filosofias de dependency management | `README.md:81-120` | Decision record + Analogy | `agents/guanabara/decision-records/ios-dependency-managers.md` | 🟠 Média |
| Project Structure (Models/Views/Controllers-Stores/Helpers) + grupos vs pastas físicas | `README.md:122-133` | Pattern + Tutorial | `agents/guanabara/onboarding/ios-project-structure.md` | 🔴 Alta |
| Localização com `.strings` + `.stringsdict` para plurais | `README.md:134-146` | Tutorial + Pattern | `agents/guanabara/tutorials/ios-localization.md` | 🟠 Média |
| Constants com `enum` escopado (Swift) vs `static const` (ObjC) — anti-`#define` | `README.md:148-178` | Code snippet + Analogy | `agents/guanabara/analogies/constants-scope.md` | 🔴 Alta |
| git-flow para releases tagueados | `README.md:180-186` | Guideline + Checklist | `agents/guanabara/onboarding/ios-branching.md` | 🟢 Baixa |
| Minimum iOS version — decisão data-driven com matriz de suporte | `README.md:188-201` | Decision record + Checklist | `agents/guanabara/decision-records/minimum-ios-version.md` | 🟠 Média |
| Curadoria consciente de dependências ("resolva com Apple frameworks primeiro") | `README.md:203-207` | Guideline + Anti-pattern | `agents/guanabara/onboarding/ios-dependency-curation.md` | 🔴 Alta |
| Event Patterns — Delegation, Callback blocks, Notification Center, KVO, Signals (ReactiveCocoa) | `README.md:251-259` | Tutorial + Analogy | `agents/guanabara/tutorials/ios-event-patterns.md` | 🔴 Alta |
| Modelos imutáveis + mapeamento JSON (Mantle/Codable/SwiftyJSON/Argo) | `README.md:261-267` | Pattern | `agents/guanabara/onboarding/ios-models.md` | 🟠 Média |
| Auto Layout: size classes, ativar constraints na init, `requiresConstraintBasedLayout` | `README.md:269-295` | Tutorial + Code snippet | `agents/guanabara/tutorials/ios-autolayout.md` | 🔴 Alta |
| MVCS / MVVM / VIPER — quando usar cada | `README.md:235-249` | Decision record + Analogy | `agents/guanabara/analogies/ios-architectures.md` | 🔴 Alta |
| Dependency Injection em ViewControllers vs Singleton global | `README.md:298-314` | Pattern + Analogy | `agents/guanabara/analogies/ios-dependency-injection.md` | 🔴 Alta |
| Stores com `SignalProducer` vs callback blocks — evitando callback hell | `README.md:315-341` | Pattern + Tutorial | `agents/guanabara/tutorials/ios-stores.md` | 🟠 Média |
| Asset Catalogs — gerenciamento de imagens bitmap/vector, otimização pngcrush/ImageOptim | `README.md:342-363` | Tutorial + Checklist | `agents/guanabara/onboarding/ios-assets.md` | 🟠 Média |
| Coding Style: naming verbo vs substantivo, `MARK:` / `#pragma mark` | `README.md:366-442` | Guideline + Template | `agents/guanabara/onboarding/ios-coding-style.md` | 🟠 Média |
| Security: Keychain vs NSUserDefaults, TLS + cert pinning, pasteboard clearing, secureTextEntry | `README.md:455-483` | Checklist + Runbook | `agents/guanabara/runbooks/ios-security-checklist.md` | 🔴 Alta |
| Diagnostics: `-Wall -Wextra -warnings-as-errors`, Clang Analyzer shallow/deep, FauxPas, exception breakpoint, Instruments Allocations | `README.md:485-540` | Runbook + Checklist | `agents/guanabara/runbooks/ios-diagnostics.md` | 🔴 Alta |
| Analytics via `AnalyticsHelper` slim + crash logs (PLCrashReporter/Fabric etc) + salvar `.xcarchive`+`dSYM` | `README.md:542-578` | Pattern + Runbook | `agents/guanabara/tutorials/ios-analytics-crash.md` | 🟠 Média |
| Building: Build Configurations, `xcconfig` com `#include`, Targets vs Configurations, Schemes naming | `README.md:583-628` | Tutorial + Template | `agents/guanabara/tutorials/ios-build-system.md` | 🔴 Alta |
| Deployment: Development vs Distribution certificates, Development vs Ad-Hoc/AppStore/Enterprise provisioning, debugging com Provisioning QuickLook | `README.md:630-673` | Tutorial + Runbook | `agents/guanabara/tutorials/ios-signing-provisioning.md` | 🔴 Alta |
| IAP receipt validation — 5 checks (authenticity/integrity/app/product/freshness) + validação server-side | `README.md:673-688` | Checklist + Decision record | `agents/guanabara/checklists/ios-iap-validation.md` | 🟠 Média |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

---

## 3. CONCEITOS ENSINÁVEIS (Visão Guanabara)

| Conceito | Analogia Sugerida | Complexidade | Destino Sugerido |
|----------|-------------------|--------------|------------------|
| **Code vs Storyboard vs Híbrido** | Planta baixa desenhada à mão (Storyboard — rápido, visual, mas rasga fácil ao dobrar) vs planta em CAD paramétrico (código — mergeável, reutilizável, previsível). Híbrido = rascunho à mão que vira CAD quando vai pra obra. | ⭐ Iniciante | `analogies/uicode-vs-storyboard.md` |
| **CocoaPods (mágico, workspace) vs Carthage (simples, binário)** | CocoaPods = buffet que monta a mesa pra você (prático, mas bagunça a cozinha); Carthage = marmita pronta que você só esquenta (menos mágica, build mais rápido). | ⭐⭐ Intermediário | `decision-records/ios-dependency-managers.md` |
| **MVCS / MVVM / VIPER** | MVCS = restaurante clássico (cozinha=Store, garçom=Controller, prato=View). MVVM = garçom vira maître que prepara o prato na bandeja (ViewModel) antes de servir, cozinha fica leve. VIPER = franquia com gerente, chef, atendente, entregador e logística — ótimo pra rede grande, overkill pra lanchonete. | ⭐⭐ Intermediário | `analogies/ios-architectures.md` |
| **Event Patterns (Delegation, Callbacks, Notifications, KVO, Signals)** | Delegation = telefone fixo (1-para-1, precisa atender). Callback = bilhete com "me liga quando pronto". Notification = alto-falante do aeroporto (1-para-muitos, quem quiser ouve). KVO = vizinho fofoqueiro que repara quando você pinta a casa sem avisar. Signals/Reactive = encanamento reativo onde você conecta canos e filtros. | ⭐⭐ Intermediário | `tutorials/ios-event-patterns.md` |
| **Auto Layout + Size Classes + requiresConstraintBasedLayout** | Móveis com elásticos e regras ("sofá sempre 20cm da parede, estica se a sala aumenta") vs móveis pregados no chão (frames fixos). `requiresConstraintBasedLayout` = avisar o pedreiro "essa parede é de drywall, não de tijolo". | ⭐⭐ Intermediário | `tutorials/ios-autolayout.md` |
| **Store como Recipe (SignalProducer)** | Receita que só vira comida quando alguém liga o fogão (subscribe). Se desligar antes, cancela o pedido (unsubscribe cancela request). | ⭐⭐⭐ Avançado | `tutorials/ios-stores.md` |
| **DI vs Singleton global** | DI = entregar a chave da sala só pra quem precisa; Singleton = deixar a chave pendurada na portaria pra qualquer um pegar (conveniente, mas perigoso). | ⭐ Iniciante | `analogies/ios-dependency-injection.md` |
| **Constants escopadas (`enum Config`) vs `#define`** | `#define` = gritar o recado no megafone (todo mundo ouve, sem tipo, sem escopo); `static let` em `enum` = bilhete nominal com carimbo e tipo. | ⭐ Iniciante | `analogies/constants-scope.md` |
| **Segurança: Keychain vs UserDefaults, cert pinning, pasteboard clearing** | UserDefaults = gaveta sem chave no escritório; Keychain = cofre com combinação. Cert pinning = só abrir a porta se o entregador mostrar crachá específico, não qualquer uniforme. Limpar pasteboard ao ir pro background = triturar o rascunho da senha antes de sair da sala. | ⭐⭐ Intermediário | `runbooks/ios-security-checklist.md` |
| **Build System: xcconfig + Targets + Schemes + Build Configurations** | `xcconfig` = ficha técnica com `#include` (herança, sem repetição); Target = modelo do carro (mesma fábrica, acabamentos diferentes); Scheme = modo de dirigir (Run/Test/Profile/Archive) mapeado pra marcha (config) e carro (target). | ⭐⭐ Intermediário | `tutorials/ios-build-system.md` |
| **Signing & Provisioning (cert + profile)** | Certificado = sua carteira de motorista (quem você é); Provisioning Profile = lista de convidados da festa + qual motorista pode dirigir qual carro em qual endereço (App ID + devices + entitlements). Debugar com QuickLook = checar a lista na porta com lanterna. | ⭐⭐⭐ Avançado | `tutorials/ios-signing-provisioning.md` |
| **IAP — 5 checks de recibo** | Recibo de compra = nota fiscal. Validar autenticidade/integridade/app/produto/frescor = conferir se a nota é da Receita, não foi rasurada, é da sua loja, do produto certo e não é xerox já usada. Server-side = caixa central confere, não o vendedor na porta. | ⭐⭐ Intermediário | `checklists/ios-iap-validation.md` |

---

## 4. ONBOARDING MATERIALS (O que pode virar guia/tutorial/glossário)

| Material | Formato Sugerido | Público | Linhas Fonte |
|----------|------------------|---------|--------------|
| **Guia "Primeiros 30 minutos em Cocoaland"** — HIG + Xcode + .gitignore + Project Setup (code vs storyboard) | Guia passo-a-passo com checklist de setup | Junior recém-chegado de Android/Web | `README.md:13-14`, `README.md:33-79` |
| **Tutorial Interativo "Monte seu primeiro Store reativo"** — contraste SignalProducer vs callback hell | Tutorial com código Swift comparando as duas APIs | Mid aprendendo arquitetura | `README.md:315-341` |
| **Glossário iOS para não-iOS** — Provisioning, Certificate, Entitlements, Scheme, Target, xcconfig, dSYM, Asset Catalog, Size Class | Glossário com analogias (placa de trânsito) | Todos | `README.md:598-671` |
| **Guia Visual "Asset Catalogs na prática"** — bitmap vs vector PDF, geração automática, otimização | Tutorial com screenshots Xcode | Designers + Juniores | `README.md:342-363` |
| **Tutorial "Auto Layout sem mistério"** — criar/ativar constraints na init, segurar referência, quando usar updateConstraints | Tutorial com diagrama ASCII de constraints | Junior → Mid | `README.md:269-295` |
| **Guia "Naming e MARK: que salvam code review"** — verbo vs substantivo, estrutura de ViewController | Template de PR + snippet | Junior | `README.md:366-442` |
| **Onboarding de Localização** — `.strings` desde o dia 1 + `.stringsdict` para plurais (ex. russo/árabe) | Guia + exercício prático | Mid | `README.md:134-146` |

---

## 5. DECISION RECORDS DIDÁTICOS (Por que X, não Y)

| Decisão | Por que X (escolhido) | Por que NÃO Y (rejeitado) | Quando Reavaliar |
|---------|-----------------------|---------------------------|------------------|
| **Views em código vs Storyboard** (`README.md:51-73`) | Código = merge fácil, DRY, informação em um lugar, sem crashes de outlet faltante detectados só em runtime | Storyboard puro = XML complexo → conflitos de merge, acoplamento código-UI não verificado pelo compilador | Reavaliar se equipe tem muitos designers não-técnicos editando UI ou se SwiftUI (declarativo) já é baseline |
| **Híbrido storyboard → código** (`README.md:71-73`) | Prototipar rápido no visual, migrar pra código quando UI amadurece e confiabilidade importa | Ficar só no storyboard ou só no código desde o dia 0 perde velocidade OU manutenibilidade | Quando projeto sai de descoberta pra escala |
| **CocoaPods commitar `Pods/` vs não commitar** (`README.md:96-97`) | Commit garante build reprodutível sem depender de `pod install` de cada dev | `pod install` pós-checkout economiza repo mas quebra se registry cai ou versão some | Com SPM + `Package.resolved` commitado, não precisa commitar binários |
| **Carthage vs CocoaPods** (`README.md:110-120`) | Carthage = sem mágica, frameworks binários, build mais rápido, qualquer projeto compilável funciona | CocoaPods = workspace mágico, centralizado, mas acopla e esconde complexidade | Hoje: avaliar SPM que herda "simplicidade" do Carthage com integração nativa |
| **MVCS como default, MVVM quando VC fica massive, VIPER só em projetos grandes** (`README.md:235-249`) | MVCS aproveita MVC nativo + Store pra networking/cache; MVVM slim-down de VC; VIPER só se testabilidade extrema compensa boilerplate | Começar de VIPER em app pequeno = overhead de 5 camadas pra CRUD simples | Se SwiftUI + TCA/Observation surgir, reescrever ADR |
| **Delegation vs Callbacks vs Notifications vs KVO vs Signals** (`README.md:251-259`) | Delegation pra 1-1 modal; callbacks escalam melhor; Notifications pra 1-muitos global; KVO desaconselhado pelo API verboso/implícito; Signals pra chaining | KVO como default = estado implícito difícil de debugar; Notification pra tudo = spaghetti global | Com Combine/async-await, "Signals" viram `AsyncSequence`/`Publisher` |
| **Modelos imutáveis + tradução de semântica remota** (`README.md:261-267`) | Imutabilidade evita estado compartilhado; Mantle/Codable traduz tipos da API (ex. string→Date) isolando mudanças de backend | Modelos mutáveis que espelham JSON 1:1 vazam detalhes de API pra UI e quebram com qualquer mudança | Revisar com `Codable` + `struct` como padrão Swift moderno |
| **Auto Layout declarativo + activate na init, não manipular frames** (`README.md:269-295`) | Sistema recalcula frames ao rotacionar/split-screen; `requiresConstraintBasedLayout = true` evita bugs de `updateConstraints` não chamado | Frames fixos quebram em iPad multitasking e rotação | SwiftUI layout system torna o debate obsoleto, mas mentalidade declarativa permanece |
| **DI via init vs Singleton global** (`README.md:298-314`) | DI = testável, explícito, sem estado global escondido | Singleton pra tudo = estado global compartilhado, testes precisam mockar global | Singleton só se estado é *realmente* global (ex. `UIApplication`) |
| **xcconfig com `#include` vs build settings na GUI** (`README.md:596-610`) | Comentários, herança, merge fácil, DRY (`Common.xcconfig`) | GUI = sem comentários, repetição, conflitos binários no `project.pbxproj` | Sempre prefira xcconfig; reavaliar com XcodeGen/Tuist se projeto cresce |
| **IAP validação server-side vs client-side** (`README.md:673-688`) | Server-side usa serviço HTTP da Apple, não precisa parsear PKCS#7/ASN.1, resiste a pirataria | Client-only = recibo pode ser forjado, lógica de validação exposta no binário | Sempre server-side se houver backend; client só se offline-first com validação local + posterior server |

---

## 6. LEARNING PATHS

### 🟢 Junior (0-6 meses em iOS) — "Sair do zero sem se afogar"
1. **Semana 1 — Terreno**: HIG (por que Apple liga pra design) → Xcode instalação + simuladores (`README.md:33-49`) → `.gitignore` Swift/ObjC (`README.md:74-79`)
2. **Semana 2 — Estrutura**: Project Structure física vs grupos (`README.md:122-133`) → Constants escopadas (`README.md:148-178`) → Naming + `MARK:` (`README.md:366-442`)
3. **Semana 3 — UI**: Storyboard vs código na prática — faça a mesma tela dos dois jeitos e compare merge/conflict (`README.md:51-73`) → Asset Catalogs + otimização (`README.md:342-363`)
4. **Semana 4 — Dados**: Modelos imutáveis + Codable básico (`README.md:261-267`) → Localization desde o dia 1 (`README.md:134-146`)
5. **Checkpoint**: Entregar uma tela com ViewController slim, DI via init, assets no catalog, strings localizadas e `.gitignore` correto. **Exercício Guanabara**: "Troque `UIColor` hardcoded por `enum Color` e veja onde o compilador te ajuda".

### 🟡 Mid (6-24 meses) — "Parar de fazer apps que só funcionam no seu simulador"
1. **Mês 1 — Arquitetura & Eventos**: MVCS vs MVVM — refatore um Massive ViewController (`README.md:235-249` + `README.md:298-314`) → Delegation vs Callbacks vs Notifications vs Signals (`README.md:251-259`)
2. **Mês 2 — Layout & Stores**: Auto Layout com size classes + `requiresConstraintBasedLayout` (`README.md:269-295`) → Stores com `SignalProducer`/callbacks e cancelamento (`README.md:315-341`)
3. **Mês 3 — Qualidade**: `-Wall -Wextra -warnings-as-errors` + Clang Analyzer shallow/deep (`README.md:487-517`) → Exception breakpoint + Instruments Allocations + FauxPas (`README.md:525-540`) → AnalyticsHelper slim (`README.md:548-578`)
4. **Mês 4 — Build & Security**: `xcconfig` + Targets + Schemes (`README.md:590-628`) → Keychain vs UserDefaults + cert pinning + pasteboard clearing (`README.md:459-477`)
5. **Checkpoint**: App com Store testável, view sem frames fixos, warnings como erros, crash reporting configurado e build `Development`/`Staging` lado a lado via `applicationIdSuffix` mentalidade (aqui via bundle identifier).

### 🔴 Senior / Tech Lead — "Fazer o time inteiro fazer certo sem você"
1. **Trilha 1 — Decisões de Plataforma**: Minimum iOS version data-driven (penetration stats + iOS Support Matrix) (`README.md:188-201`) → Curadoria de dependências ("Apple frameworks first") + comparação CocoaPods/Carthage/SPM (`README.md:203-215`)
2. **Trilha 2 — Entrega**: Signing & Provisioning mental model + debugging com QuickLook (`README.md:630-664`) → Build Configurations por environment (`README.md:590-610`) → Salvar `.xcarchive`+`dSYM` pra simbolicação (`README.md:577-578`) → IAP server-side validation 5-checks (`README.md:673-688`)
3. **Trilha 3 — Cultura**: Escrever ADRs didáticos (ex. "Por que MVVM aqui, não VIPER") → Criar runbooks de diagnostics/profiling → Ensinar juniores com analogias (restaurante, encanamento, planta CAD)
4. **Checkpoint**: ADR publicado, pipeline que trata warnings como erros em release, runbook de provisioning que um junior consegue seguir sozinho, e decisão documentada de quando migrar pra SwiftUI/Combine.

---

## 7. ANTI-PATTERNS PARA ENSINAR (O que NÃO fazer)

| Anti-Pattern | Analogia | Por Que Dói | Como Ensinar o Certo |
|--------------|----------|-------------|----------------------|
| **Storyboard gigante único + outlets não conectados** (`README.md:51-59`) | Planta de prédio inteiro numa folha A3 — todo mundo risca junto, rasga e ninguém sabe quem apagou a porta (crash só em runtime, sem ajuda do compilador) | Merge hell por XML, crashes de outlet/action faltante | Quebrar em XIBs pequenos ou código; híbrido: rascunho em storyboard, produção em código |
| **Manipular `view.frame` direto em vez de Auto Layout** (`README.md:269-276`) | PregAR móveis no chão vs usar elásticos com regras — na primeira rotação/split-screen tudo quebra | Não adapta a iPad multitasking, rotação, Dynamic Type | Declarar constraints e ativar na init; segurar referência pra ativar/desativar |
| **Singleton como "saco de estado global"** (`README.md:298-304`) | Chave mestra pendurada na portaria — todo mundo pega, ninguém devolve, ninguém sabe quem trancou a porta | Estado compartilhado escondido, testes frágeis | Injetar via `init(withViewModel:)`; singleton só se estado é *realmente* global |
| **Massive View Controller** (`README.md:311-314`) | Garçom que também cozinha, lava louça e faz contabilidade — uma gripe e o restaurante fecha | Lógica de negócio presa em lifecycle de UI, impossível testar | Extrair para ViewModel/Store/Helper (MVVM/MVCS) |
| **`#define` pra constantes app-wide** (`README.md:172-178`) | Megafone na fábrica — todo mundo ouve, sem tipo, pode ser redefinido no meio do turno, debugger não enxerga | Sem type-safety, escopo global, redefinição silenciosa | `enum Config { static let baseURL }` (Swift) ou `static NSString * const` (ObjC) |
| **Guardar senha/token em `NSUserDefaults` / plist / Core Data sem criptografia** (`README.md:459-464`) | Guardar dinheiro na gaveta da mesa vs cofre (Keychain) | Dados em claro, acessível fora do app, sem proteção de device lock | Keychain com `kSecAttrAccessible...` correto; limpar quando não precisa mais |
| **HTTP sem TLS ou sem cert pinning** (`README.md:466-467`) | Mandar carta aberta vs carta lacrada com selo que só o destinatário reconhece | Man-in-the-middle intercepta tráfego | TLS sempre + pinning via AFNetworking/Alamofire (ou `URLSession` moderno) |
| **Logar senhas/tokens em produção** (`README.md:469-471`) | Deixar o extrato bancário na impressora compartilhada | Vazamento em logs de crash/analytics | Níveis de log por environment; `debug` verboso, `release` só fluxo básico |
| **KVO como default pra tudo** (`README.md:258`) | Vizinho que espia pela janela sem você avisar que mudou a cortina — funciona, mas ninguém sabe quem está observando quem | Implícito, API verbosa, difícil de remover observador | Preferir delegation/callbacks/signals explícitos |
| **Ignorar warnings / não tratar warnings como erros** (`README.md:487-499`) | Ignorar luz do painel "óleo baixo" — parece inofensivo até o motor fundir | Warnings acumulam e escondem bugs reais | `-Wall -Wextra -warnings-as-errors` desde o dia 1 |
| **Validar recibo IAP só no client** (`README.md:673-688`) | Deixar o cliente carimbar o próprio passaporte — falsificável | Pirataria trivial, parsing PKCS#7 complexo e frágil | Validar 5 checks server-side e guardar conteúdo no servidor |

---

## 8. GAPS DE CONHECIMENTO (O que o repo NÃO cobre mas deveria)

- [ ] **Gap 1: Testes ausentes** — Seção "More Ideas" admite `Add section on Testing` (`README.md:700`) mas nunca foi feita. **Sugestão**: Criar `agents/guanabara/tutorials/ios-testing.md` cobrindo XCTest, `XCUITest`, mocks vs fakes, e por que não testar via UI tudo (pirâmide de testes). Conectar com Diagnostics/Profiling já existente.
- [ ] **Gap 2: Swift moderno & SwiftUI/Combine/async-await** — Repo parou no Swift 2/3, sem menção a `Codable` moderno (só link), sem SwiftUI, sem Combine, sem `async/await`, sem `Actors`. **Sugestão**: Criar `agents/guanabara/decision-records/swift-concurrency-migration.md` e atualizar analogias de Signals → `AsyncStream`/`Publisher`.
- [ ] **Gap 3: Gerenciamento de dependências atual** — Só CocoaPods/Carthage, zero SPM (padrão desde Xcode 11). Recomendação de commitar `Pods/` é hoje anti-pattern com `Package.resolved`. **Sugestão**: Reescrever `ios-dependency-managers.md` com SPM como default, `Package.resolved` commitado, e Carthage como nota histórica.
- [ ] **Gap 4: CI/CD e automação** — Só "Ask IT about Jenkins" (`README.md:699`). Nada sobre Fastlane, GitHub Actions, TestFlight upload, notarização, versionamento automático. **Sugestão**: Criar `agents/guanabara/runbooks/ios-ci-cd.md` com Fastlane Match + GitHub Actions.
- [ ] **Gap 5: Acessibilidade & Dark Mode & Dynamic Type** — HIG citado (`README.md:35-39`) mas sem VoiceOver, Dynamic Type, contrast, Dark Mode, localization além de strings. **Sugestão**: Adicionar ao onboarding `ios-a11y.md`.
- [ ] **Gap 6: Privacidade & Compliance (App Tracking Transparency, Privacy Manifests)** — Security foca em Keychain/TLS mas ignora ATT, `Info.plist` privacy strings, GDPR. **Sugestão**: Estender `runbooks/ios-security-checklist.md` com checklist de privacy.
- [ ] **Gap 7: Gerenciamento de segredo em build (API keys, bundle IDs por environment)** — `xcconfig` mencionado mas sem exemplo de secrets por environment (ex. `API_KEY` via `xcconfig` + `Info.plist` variável). **Sugestão**: Exemplo prático em `tutorials/ios-build-system.md`.

---

## 9. TEMPLATES / CHECKLISTS / RUNBOOKS / SKILLS Didáticos a Criar

| Tipo | Nome Proposto | Local Sugerido | Conteúdo Base (linhas fonte) |
|------|---------------|----------------|------------------------------|
| **Template** | `ios-viewcontroller-structure.swift` | `_consolidado/templates/ios/` | Esqueleto com `MARK: Lifecycle / View Lifecycle / Layout / User Interaction / Delegate / Helpers` (`README.md:388-438`) |
| **Template** | `ios-xcconfig-starter` (`Common.xcconfig`, `Debug.xcconfig`, `Release.xcconfig` com `#include`) | `_consolidado/templates/ios/xcconfig/` | Comentários + `#include "Common.xcconfig"` + override (`README.md:598-610`) |
| **Template** | `ios-constants.swift` (`enum Config`, `enum Color` com `#colorLiteral`) | `_consolidado/templates/ios/` | `README.md:152-168` |
| **Checklist** | `ios-security-release-checklist.md` | `_consolidado/agents/guanabara/checklists/` | Keychain, `secureTextEntry`, autocorrection off, pasteboard clear em `applicationDidEnterBackground`, TLS+pinning, log levels (`README.md:459-477`) |
| **Checklist** | `ios-iap-validation.md` (5 checks) | `_consolidado/agents/guanabara/checklists/` | Authenticity/Integrity/App match/Product match/Freshness + server-side (`README.md:673-688`) |
| **Checklist** | `ios-provisioning-debug.md` | `_consolidado/agents/guanabara/checklists/` | QuickLook em `~/Library/MobileDevice/Provisioning Profiles` + `.ipa`→`.zip`→`embedded.mobileprovision` (`README.md:657-664`) |
| **Runbook** | `ios-diagnostics.md` (warnings-as-errors, Clang Analyzer shallow/deep, exception breakpoint, Instruments Allocations) | `_consolidado/agents/guanabara/runbooks/` | `README.md:485-540` |
| **Runbook** | `ios-build-and-archive.md` (salvar `.xcarchive`+`dSYM`, simbolicação) | `_consolidado/agents/guanabara/runbooks/` | `README.md:577-578` + `README.md:590-628` |
| **Skill** | `guanabara-ios-onboarding` | `_consolidado/skills/guanabara-ios-onboarding/` | Orquestra os Learning Paths Junior/Mid/Senior com quizzes "faz sentido? quer que eu aprofunde?" |
| **Analogy Pack** | `ios-analogies-bundle` (8 analogias) | `_consolidado/agents/guanabara/analogies/` | Code vs Storyboard (planta), DI vs Singleton (chaves), Store Recipe, MV* restaurante, KVO vizinho, cert/profile festa, IAP nota fiscal, constraints elásticos |

---

## 10. FONTES (Deep Links)

| Fonte | Linha/Seção |
|-------|-------------|
| Propósito "living document will rot" + convite pra contribuir | `README.md:4` |
| Why iOS é intimidador (Swift/ObjC, nomes próprios, device) | `README.md:11-13` |
| Sumário 11 seções (Getting Started → IAP) | `README.md:15-31` |
| HIG + Xcode + AppCode | `README.md:33-49` |
| Code vs Storyboards vs Híbrido | `README.md:51-73` |
| `.gitignore` Swift/ObjC | `README.md:74-79` |
| CocoaPods setup + commit Pods | `README.md:81-108` |
| Carthage "simple, not easy" + frameworks binários | `README.md:110-120` |
| Project Structure grupos vs pastas | `README.md:122-133` |
| Localization + `.stringsdict` plurais | `README.md:134-146` |
| Constants `enum` + anti-`#define` | `README.md:148-178` |
| git-flow | `README.md:180-186` |
| Minimum iOS version + stats | `README.md:188-201` |
| "Solve with Apple frameworks first" | `README.md:203-206` |
| AFNetworking/Alamofire, DateTools, Auto Layout libs | `README.md:209-233` |
| MVCS / MVVM / VIPER | `README.md:235-249` |
| Event Patterns (5) | `README.md:251-259` |
| Models imutáveis + Mantle/Codable | `README.md:261-267` |
| Auto Layout + size classes + `requiresConstraintBasedLayout` | `README.md:269-295` |
| DI vs Singleton + Massive VC | `README.md:298-314` |
| Stores + SignalProducer + callback hell | `README.md:315-341` |
| Asset Catalogs + vector PDF + pngcrush/ImageOptim | `README.md:342-363` |
| Coding Style naming + `MARK:` | `README.md:366-442` |
| Security (Keychain, TLS pinning, logging, pasteboard) | `README.md:455-483` |
| Diagnostics (warnings, Clang Analyzer, FauxPas, Instruments) | `README.md:485-540` |
| AnalyticsHelper + Crash logs + `.xcarchive`/`dSYM` | `README.md:542-578` |
| Build Configurations + xcconfig + Targets + Schemes | `README.md:583-628` |
| Signing (Development vs Distribution) + Provisioning (Development/Ad-Hoc/App Store/Enterprise) + debugging | `README.md:630-664` |
| IAP 5 checks + server-side | `README.md:673-688` |
| More Ideas (gaps assumidos) | `README.md:696-701` |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| CocoaPods como default + commitar `Pods/` | `README.md:81-108` | SPM é padrão nativo desde Xcode 11; commitar `Pods/` infla repo e esconde `Package.resolved` como source of truth | SPM + `Package.resolved` commitado; `Pods/` em `.gitignore` se ainda usar CocoaPods |
| Carthage como alternativa principal | `README.md:110-120` | Quase abandonado; SPM herda filosofia "simples" com integração nativa | SPM |
| Fabric / HockeyApp / Crittercism / Mint como crash services | `README.md:567-573` | Fabric morto (virou Firebase Crashlytics), HockeyApp morto (virou App Center → morto), Crittercism virou Apteligent | Firebase Crashlytics / Sentry |
| AFNetworking (ObjC) como recomendação | `README.md:209-214` | ObjC legacy; Alamofire também em declínio frente a `URLSession` moderno + `async/await` | `URLSession` + `async/await` / Alamofire 5 se precisar de conveniências |
| DateTools, Masonry/SnapKit, Cartography, PureLayout, FLKAutoLayout | `README.md:216-233` | iOS 9 `NSLayoutAnchor` já resolveu verbosidade; SnapKit ainda usado mas não essencial | `NSLayoutAnchor` / `UILayoutGuide`; SnapKit só se DSL realmente acelera |
| Mantle / SwiftyJSON / Argo | `README.md:261-267` | Substituídos por `Codable` nativo (Swift 4+) com `struct` imutável | `Codable` + `struct` / `Codable` com `keyDecodingStrategy` |
| ReactiveCocoa `SignalProducer`/`RACSignal` como padrão de Store | `README.md:315-341` | Curva alta, bridging ObjC/Swift dolorido; Combine/async-await são padrão | Combine `Publisher` / `async/await` + `AsyncSequence` |
| `NSURL` sem `URL`, `UIColor` sem `UIColor(named:)` (asset catalog) | `README.md:152-165` | API renomeada em Swift 3+; `UIColor(named:)` do catalog é preferível a `static let` | `URL`, `UIColor(named:)` |
| `SSKeychain` / `UICKeyChainStore` | `README.md:460-461` | Wrappers antigos; Keychain API moderna tem `kSecUseAuthenticationContext` etc. | `KeychainAccess` / `Valet` / `Security` framework direto |
| FauxPas, Reveal, Spark Inspector | `README.md:517-532` | FauxPas sem Swift, Reveal/Spark pagos e substituídos por View Debugger nativo | Xcode View Debugger + SwiftLint + SwiftFormat |
| `Other Warning Flags -Wall -Wextra` manual | `README.md:491-494` | Xcode hoje tem `ENABLE_STRICT_OBJC_MSGSEND`, `SWIFT_TREAT_WARNINGS_AS_ERRORS` nativo | Build Settings modernos + SwiftLint rules |
| TestFlight "recém adquirido pela Apple, 1000 users" | `README.md:647` | TestFlight hoje nativo no App Store Connect, até 10k testers externos, sem Ad-Hoc de 100 devices como limite prático | TestFlight nativo |
| `pngcrush` manual para app icons | `README.md:359-363` | Xcode asset catalog já comprime; App Store exige App Icon via catalog | Asset Catalog + `actool` + ImageOptim opcional |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para Guanabara)

- [ ] Gap 1: **Trilha de testes** — Sugestão: criar `tutorials/ios-testing.md` com pirâmide XCTest / XCUITest / snapshot tests
- [ ] Gap 2: **Swift Concurrency & SwiftUI** — Sugestão: `decision-records/swift-concurrency-migration.md` comparando Signals → Combine → async/await
- [ ] Gap 3: **SPM como padrão** — Sugestão: atualizar `decision-records/ios-dependency-managers.md`
- [ ] Gap 4: **CI/CD com Fastlane + GitHub Actions** — Sugestão: `runbooks/ios-ci-cd.md`
- [ ] Gap 5: **Acessibilidade / Dark Mode / Dynamic Type** — Sugestão: `onboarding/ios-a11y.md`
- [ ] Gap 6: **Privacy Manifests & ATT** — Sugestão: estender `runbooks/ios-security-checklist.md`
- [ ] Gap 7: **Secrets por environment via xcconfig** — Sugestão: exemplo em `tutorials/ios-build-system.md`

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Guanabara)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: analogias de Store/DI/MV* e checklists de Security/IAP/Diagnostics extraídos acima
- [ ] **Criar ADR**: `ios-ui-approach` — Code vs Storyboard vs SwiftUI — Para: padronizar decisão de UI em novos projetos
- [ ] **Criar ADR**: `ios-dependency-managers` — SPM como default — Para: aposentar CocoaPods/Carthage como recomendação
- [ ] **Criar Template**: `ios-viewcontroller-structure.swift` + `ios-xcconfig-starter` — Em: `_consolidado/templates/ios/`
- [ ] **Criar Checklist**: `ios-security-release-checklist.md` + `ios-iap-validation.md` + `ios-provisioning-debug.md` — Em: `agents/guanabara/checklists/`
- [ ] **Criar Runbook**: `ios-diagnostics.md` + `ios-build-and-archive.md` — Em: `agents/guanabara/runbooks/`
- [ ] **Criar Skill**: `guanabara-ios-onboarding` — Em: `_consolidado/skills/guanabara-ios-onboarding/` — orquestra Junior→Mid→Senior com validação "faz sentido?"
- [ ] **Criar Analogy/Tutorial**: 8 analogias (planta CAD, chaves, receita, restaurante, vizinho KVO, festa provisioning, nota fiscal IAP, elásticos) + 5 tutoriais (event patterns, autolayout, stores, signing, analytics) — Em: `agents/guanabara/{analogies|tutorials}/`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES

> `README.md:4` — "Just like software, this document will rot unless we take care of it. We encourage everyone to help us on that – just open an issue or send a pull request!"

> `README.md:11-13` — "Getting on board with iOS can be intimidating. Neither Swift nor Objective-C are widely used elsewhere, the platform has its own names for almost everything, and it's a bumpy road for your code to actually make it onto a physical device."

> `README.md:58` — "It's easier to structure and reuse views in code, thereby keeping your codebase DRY."

> `README.md:205` — "Always consider solving the problem using Apple's extensive (and mostly excellent) frameworks first!"

> `README.md:459-461` — "Never use NSUserDefaults, other plist files on disk or Core Data for this, as they are not encrypted! In most such cases, the iOS Keychain is your friend."

> `README.md:488` — "Enable as many compiler warnings as possible and treat those warnings as errors -- it will be worth it in the long run."

> `README.md:682` — "Whenever possible, design your IAP system to store the content for sale server-side, and provide it to the client only in exchange for a valid receipt that passes all of the above checks."

---

## 7. SCORE DE VALOR DO REPO (Para Guanabara)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 4 | Altíssima para ensino: project setup, arquitetura, eventos, segurança, build/signing são atemporais e didáticos. Perde 1 ponto por ser iOS-específico (não cross-plataforma). |
| **Qualidade** | 4 | Texto claro, trade-offs explícitos (code vs storyboard, CocoaPods vs Carthage, MV*), snippets práticos, analogias naturais. Falta profundidade em testes e exemplos executáveis. |
| **Atualidade** | 2 | Congelado em 2016-17. Tooling (Carthage, Fabric, Manual warnings, AFNetworking ObjC) desatualizado. Conceitos permanecem, mas todo exemplo precisa de "tradução" pra Swift 5/6, SPM, SwiftUI, async-await. |
| **Ação** | 4 | Gera imediatamente 3 templates, 3 checklists, 2 runbooks, 1 skill e 8 analogias — tudo aplicável em onboarding real com pouca adaptação. |
| **Completude** | 3 | Cobre 11 temas end-to-end, mas admite gaps (Testing, "proven don'ts", CI) e ignora tópicos modernos (a11y, privacy, SPM, SwiftUI). |
| **TOTAL** | **17/25** | **Extrair seletivo — priorizar conceitos atemporais, descartar tooling legacy com nota de substituição** |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa" → **17 = limite superior do "seletivo"; vale extração completa DOS CONCEITOS, com camada de modernização.**

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/guanabara/extractions/ios-good-practices.md`
- [x] Avisar seu Lead (Guanabara) que a extração está pronta
- [x] Mover para próximo repo na fila

---

*Template v1.0 — Guanabara Batch 1 — ios-good-practices — 2026-10-08*