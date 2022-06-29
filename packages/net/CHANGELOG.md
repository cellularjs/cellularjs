# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.8.0-alpha.0](https://github.com/cellularjs/cellularjs/compare/v0.7.4...v0.8.0-alpha.0) (2022-06-29)

**Note:** Version bump only for package @cellularjs/net





## [0.7.4](https://github.com/cellularjs/cellularjs/compare/v0.7.3...v0.7.4) (2022-06-26)

**Note:** Version bump only for package @cellularjs/net






## [0.7.3](https://github.com/cellularjs/cellularjs/compare/v0.7.2...v0.7.3) (2022-05-12)

**Note:** Version bump only for package @cellularjs/net





## [0.7.2](https://github.com/cellularjs/cellularjs/compare/v0.7.1...v0.7.2) (2022-04-09)

**Note:** Version bump only for package @cellularjs/net





## [0.7.1](https://github.com/cellularjs/cellularjs/compare/v0.7.0...v0.7.1) (2022-04-09)

**Note:** Version bump only for package @cellularjs/net





# [0.7.0](https://github.com/cellularjs/cellularjs/compare/v0.6.0...v0.7.0) (2022-03-29)

**Note:** Version bump only for package @cellularjs/net





# [0.6.0](https://github.com/cellularjs/cellularjs/compare/v0.5.0...v0.6.0) (2022-03-26)


### Features

* **net:** make error code cleaner ([855ac4c](https://github.com/cellularjs/cellularjs/commit/855ac4c778fd0a5313a8aea17742fa952ac49bbb))






# [0.5.0](https://github.com/cellularjs/cellularjs/compare/v0.4.0...v0.5.0) (2022-03-19)


### Features

* **net:** add service name into referer header of IRQ ([aeb0a04](https://github.com/cellularjs/cellularjs/commit/aeb0a04cd2c568d6c09c86c6e11be67ecdf8cdd9)), closes [#11](https://github.com/cellularjs/cellularjs/issues/11)






# [0.4.0](https://github.com/cellularjs/cellularjs/compare/v0.3.0...v0.4.0) (2022-03-13)

**Note:** Version bump only for package @cellularjs/net





# [0.3.0](https://github.com/cellularjs/cellularjs/compare/v0.2.0...v0.3.0) (2022-03-05)


### Features

* **net:** public ToTargetHeader interface ([936afbb](https://github.com/cellularjs/cellularjs/commit/936afbbbb40b10ea274a73ca9f091a064028e76c))






# [0.2.0](https://github.com/cellularjs/cellularjs/compare/v0.1.2...v0.2.0) (2022-03-03)

**Note:** Version bump only for package @cellularjs/net






## [0.1.2](https://github.com/cellularjs/cellularjs/compare/v0.1.1...v0.1.2) (2022-02-26)

**Note:** Version bump only for package @cellularjs/net





## [0.1.1](https://github.com/cellularjs/cellularjs/compare/v0.1.0...v0.1.1) (2022-02-26)

**Note:** Version bump only for package @cellularjs/net






# 0.1.0 (2022-02-05)


### Bug Fixes

* **net:** ignore .d.ts file not *d.ts ([65cd3bb](https://github.com/cellularjs/cellularjs/commit/65cd3bb48df118e4e398064044d0381e25414dda))
* **net:** make providers adding by addServiceProviders work as extend providers ([d9fbb0d](https://github.com/cellularjs/cellularjs/commit/d9fbb0d8f6508db700409064060cebdca31a03a5))


### Features

* add basic stuff, make it work ([fa62d39](https://github.com/cellularjs/cellularjs/commit/fa62d3951db14453997c3579543d6342816ed715))
* **di, net:** set default type for GenericProvider ([9730ddf](https://github.com/cellularjs/cellularjs/commit/9730ddf5d0cb765767e52907e281543b41a7cdd7))
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
