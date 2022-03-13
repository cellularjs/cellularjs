# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.4.0](https://github.com/cellularjs/cellularjs/compare/v0.3.0...v0.4.0) (2022-03-13)


### Features

* **cli:** support run dev/build with multilpe entries [#9](https://github.com/cellularjs/cellularjs/issues/9) ([f654202](https://github.com/cellularjs/cellularjs/commit/f654202c32704aa929186f444a86369c931181c7))





# [0.3.0](https://github.com/cellularjs/cellularjs/compare/v0.2.0...v0.3.0) (2022-03-05)


### Features

* **express-proxy:** add express proxy ([#7](https://github.com/cellularjs/cellularjs/issues/7)) ([2faf28b](https://github.com/cellularjs/cellularjs/commit/2faf28b9b6215ee0455f1fd65073f20be43aab64))
* **net:** public ToTargetHeader interface ([936afbb](https://github.com/cellularjs/cellularjs/commit/936afbbbb40b10ea274a73ca9f091a064028e76c))






# [0.2.0](https://github.com/cellularjs/cellularjs/compare/v0.1.2...v0.2.0) (2022-03-03)


* feat(di)!: make better service interoperability for extModule ([87f183e](https://github.com/cellularjs/cellularjs/commit/87f183e97afdd0e6e818edcc5423604deea22b3c))
* feat(di)!: first step to make better service interoperability ([f6c064b](https://github.com/cellularjs/cellularjs/commit/f6c064bf6ccca43e31cd2cee0eeee1796633d75f))


### BREAKING CHANGES

* same as #5
* Correctly, breaking behavior. At previous version, if client code declare a service in both `exports` and `providers`, it will cause error. So this new behavior will not make current code of client crash.






## [0.1.2](https://github.com/cellularjs/cellularjs/compare/v0.1.1...v0.1.2) (2022-02-26)

**Note:** Version bump only for package cellularjs





## [0.1.1](https://github.com/cellularjs/cellularjs/compare/v0.1.0...v0.1.1) (2022-02-26)

**Note:** Version bump only for package cellularjs






# 0.1.0 (2022-02-05)


### Bug Fixes

* **cli:** add .gitignore file when initializing project structure ([71f7743](https://github.com/cellularjs/cellularjs/commit/71f7743f9d54a46876871e792159db6b229d5dae))
* **di:** resolve dependencies of useClass and useFunc provider one by one ([9b7baee](https://github.com/cellularjs/cellularjs/commit/9b7baeed183cfafb3086f762253d9287ae8116cd))
* make resolve with global module and extend module work in async environment ([490f523](https://github.com/cellularjs/cellularjs/commit/490f5238286b3fdff85b51cb475de3dc4dc4d97a))
* **net:** ignore .d.ts file not *d.ts ([65cd3bb](https://github.com/cellularjs/cellularjs/commit/65cd3bb48df118e4e398064044d0381e25414dda))
* **net:** make providers adding by addServiceProviders work as extend providers ([d9fbb0d](https://github.com/cellularjs/cellularjs/commit/d9fbb0d8f6508db700409064060cebdca31a03a5))


### Features

* add basic stuff, make it work ([fa62d39](https://github.com/cellularjs/cellularjs/commit/fa62d3951db14453997c3579543d6342816ed715))
* add resolveWithTmpGlobalProviders ([ca5d11d](https://github.com/cellularjs/cellularjs/commit/ca5d11dff50c1288df0481cddfe566e0f5591689))
* allow to detect cellularjs injectable and module ([940047c](https://github.com/cellularjs/cellularjs/commit/940047cf02fd1777f5e7c19b8ab20c19ee66282d))
* **cli:** add .env file into halo template ([d36cba9](https://github.com/cellularjs/cellularjs/commit/d36cba989a471613f945960f5bafc1a8145ac19a))
* **cli:** add basic build command ([b12576c](https://github.com/cellularjs/cellularjs/commit/b12576c8a142c233ccd029cedef23ed44eb2bcc0))
* **cli:** init cli project with simple init command ([4e6ecb9](https://github.com/cellularjs/cellularjs/commit/4e6ecb94b09263098e88c668a3b83df422328e34))
* **cli:** support basic dev environment ([edb91fc](https://github.com/cellularjs/cellularjs/commit/edb91fc234d3fc977b23bec5fa683d9932b80de7))
* **cli:** use entry name as build folder name ([2e9b673](https://github.com/cellularjs/cellularjs/commit/2e9b6737ab5f971a3e172e7f262d9622b8d54d6c))
* **di - optional decorator:** re-throw error immediately if it is not NoProviderForToken error ([9778173](https://github.com/cellularjs/cellularjs/commit/9778173f1974610d610529c6549cc847b707b552))
* **di, net:** set default type for GenericProvider ([9730ddf](https://github.com/cellularjs/cellularjs/commit/9730ddf5d0cb765767e52907e281543b41a7cdd7))
* **di:** add Optional decorator ([c08f950](https://github.com/cellularjs/cellularjs/commit/c08f9500eff8df0924016d73b418dcd4354b6c54))
* **di:** add useExisting provider ([7aff1fe](https://github.com/cellularjs/cellularjs/commit/7aff1fe0547a4509f0ece8a18b054452843c0727))
* **di:** allow to import exported module automatically ([ab6e0e2](https://github.com/cellularjs/cellularjs/commit/ab6e0e21e82dacc65f2c0bcd1abd4f96c336c78f))
* **di:** follow API design, delete remove method from container ([4c048d7](https://github.com/cellularjs/cellularjs/commit/4c048d7e123a759a6ffbf0b24fca5115528ca18a))
* **di:** make addModule, addProvider async ([3bd610b](https://github.com/cellularjs/cellularjs/commit/3bd610bc7a9ce9cbc733416ee2fa961adc63fc10))
* **di:** rename BaseProvder to ProviderHasToken ([8e0a067](https://github.com/cellularjs/cellularjs/commit/8e0a067e6e941bc04ebfc7c5f3a6afd88a69a960))
* **di:** revert remove method ([d3704ee](https://github.com/cellularjs/cellularjs/commit/d3704eed21d47ae48e23ca6871a7a992cb57ee5c))
* **di:** support circular dependency for class with forwardRef ([e331e42](https://github.com/cellularjs/cellularjs/commit/e331e42eb9bdd08e4eb5fd1c65fd4f4c7bb40b98))
* **di:** support circular dependency for useFunc provider with forwardRef ([3ff4e92](https://github.com/cellularjs/cellularjs/commit/3ff4e920aec49aeca95fa7a9ad3e47c2fef3ca6f))
* **di:** support onInit hook for module class ([0bdeb46](https://github.com/cellularjs/cellularjs/commit/0bdeb463f28c49a8bc311ea566c12683f9a1635b))
* init - move DI to standalone repository ([dcb86c1](https://github.com/cellularjs/cellularjs/commit/dcb86c1bd772c5a5f7a619001dca30aa29a07e27))
* init - move Net to standalone repository ([96b1515](https://github.com/cellularjs/cellularjs/commit/96b1515afd60884a19be4c12d0cae334eba9aa4a))
* **net:** add basic message helper methods ([9d97026](https://github.com/cellularjs/cellularjs/commit/9d970266924d4dc903cf9e582af83080a11381b0))
* **net:** add NextHandler that allow to resolve and run handler lazily ([979a1c2](https://github.com/cellularjs/cellularjs/commit/979a1c230b9089a2c1667f5fb6ba11de494f82ea))
* **net:** add transportEmitter ([debcb0d](https://github.com/cellularjs/cellularjs/commit/debcb0d3dc07d3ea5140fde6874c2d6176904f3b))
* **net:** allow service handler to return data that is not IRS object ([50945fc](https://github.com/cellularjs/cellularjs/commit/50945fc5d67d07b65ed39dfca56bc049d5c7bdc4))
* **net:** apply async addModule, addProvider ([0447f4f](https://github.com/cellularjs/cellularjs/commit/0447f4f6bb99d8ac2cd0116463ca46aa14aa2c61))
* **net:** default success status code should be 200 ([0dd8ab9](https://github.com/cellularjs/cellularjs/commit/0dd8ab9f11bfae9ea94c7a2706327ca7a1969e1e))
* **net:** default value for IRQ, IRS ([b0a9dac](https://github.com/cellularjs/cellularjs/commit/b0a9dacdf52de0d903215f256545a865933256c0))
* **net:** each "cell" should have only one CellContext ([13aa7d4](https://github.com/cellularjs/cellularjs/commit/13aa7d4248213d5dfc61f73a52ca73b4db9e4b53))
* **net:** follow private by default strategy ([7f4d5f8](https://github.com/cellularjs/cellularjs/commit/7f4d5f83532591ead4260114f3c67647499fff43))
* **net:** make header and body of IRS have same order as IRQ ([7c53be9](https://github.com/cellularjs/cellularjs/commit/7c53be979c95638ee7de7fb825ef3f2bd48ee6fe))
* **net:** move referer into request header ([069286c](https://github.com/cellularjs/cellularjs/commit/069286ce0f160230734029191aae4f33efe5df6e))
* **net:** remove CLL_IRQ token, use IRQ class as token instead ([5d3044f](https://github.com/cellularjs/cellularjs/commit/5d3044fb39e69200f0ea79e5d1fe73ae7fd29a25))
* **net:** remove context option from @Cell decorator ([0cb63b1](https://github.com/cellularjs/cellularjs/commit/0cb63b10053544769af69b6cb9252916c2987369))
* **net:** rename public scope to publish ([489af74](https://github.com/cellularjs/cellularjs/commit/489af74cc9c48a027a0e8e42f4e39fba37134d46))
* **net:** returned data from service proxy must be IRS instance ([b6c3de7](https://github.com/cellularjs/cellularjs/commit/b6c3de748670a51cf82eb752ff4668da11c1ab67))
* **net:** support code that built by bundler such as Webpack ([f078e03](https://github.com/cellularjs/cellularjs/commit/f078e030032fc375742f470c110a9baf5f317b77))
* **net:** support listen to request event async ([c9b94b8](https://github.com/cellularjs/cellularjs/commit/c9b94b8e075555e3ed4df5b28ab34f715d1455c9))
* **net:** use correct token name for service ([989d6a2](https://github.com/cellularjs/cellularjs/commit/989d6a25786cbe3381cf860c853b41d332933005))
* **net:** use original status code instead of custom status code ([194455a](https://github.com/cellularjs/cellularjs/commit/194455ab439e9b682bc36884ff42dfc81cfe9342))
* **net:** use ServiceHandler class as a token for dependency injection ([7a405e4](https://github.com/cellularjs/cellularjs/commit/7a405e4886d1753687d3c6bcb29a78a18dd99443))
* **net:** use shorter name for driver option ([1df5fc0](https://github.com/cellularjs/cellularjs/commit/1df5fc0821ce16608aa186e31fdcba109cbd35c8))
* remove support for multiple type of route strategy ([f682c84](https://github.com/cellularjs/cellularjs/commit/f682c84883ed47c6c956ab516730d731d0c1e567))
* rename DEFAULT_DRIVER to LOCAL_DRIVER ([28da3fa](https://github.com/cellularjs/cellularjs/commit/28da3fa436659de10275582d55d966ff245739d5))
* rename ErrorCode to NetErrorCode ([f16aa79](https://github.com/cellularjs/cellularjs/commit/f16aa79201a132b639d1f66ea0b11bd003ade83a))
* support resolve async provider ([e1d2433](https://github.com/cellularjs/cellularjs/commit/e1d24337a859a35e1b481a48499c16e3734ff160))
