# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.6.0](https://github.com/cellularjs/cellularjs/compare/v0.5.0...v0.6.0) (2022-03-26)


### Features

* **di:** make error code cleaner ([53b1300](https://github.com/cellularjs/cellularjs/commit/53b1300699d932f625dd45195f842a5dc5c2a4d9))






# [0.5.0](https://github.com/cellularjs/cellularjs/compare/v0.4.0...v0.5.0) (2022-03-19)

**Note:** Version bump only for package @cellularjs/di






# [0.4.0](https://github.com/cellularjs/cellularjs/compare/v0.3.0...v0.4.0) (2022-03-13)

**Note:** Version bump only for package @cellularjs/di





# [0.3.0](https://github.com/cellularjs/cellularjs/compare/v0.2.0...v0.3.0) (2022-03-05)

**Note:** Version bump only for package @cellularjs/di






# [0.2.0](https://github.com/cellularjs/cellularjs/compare/v0.1.2...v0.2.0) (2022-03-03)


* feat(di)!: make better service interoperability for extModule ([87f183e](https://github.com/cellularjs/cellularjs/commit/87f183e97afdd0e6e818edcc5423604deea22b3c))
* feat(di)!: first step to make better service interoperability ([f6c064b](https://github.com/cellularjs/cellularjs/commit/f6c064bf6ccca43e31cd2cee0eeee1796633d75f))


### BREAKING CHANGES

* same as #5
* Correctly, breaking behavior. At previous version, if client code declare a service in both `exports` and `providers`, it will cause error. So this new behavior will not make current code of client crash.






## [0.1.2](https://github.com/cellularjs/cellularjs/compare/v0.1.1...v0.1.2) (2022-02-26)

**Note:** Version bump only for package @cellularjs/di





## [0.1.1](https://github.com/cellularjs/cellularjs/compare/v0.1.0...v0.1.1) (2022-02-26)

**Note:** Version bump only for package @cellularjs/di






# 0.1.0 (2022-02-05)


### Bug Fixes

* **di:** resolve dependencies of useClass and useFunc provider one by one ([9b7baee](https://github.com/cellularjs/cellularjs/commit/9b7baeed183cfafb3086f762253d9287ae8116cd))
* make resolve with global module and extend module work in async environment ([490f523](https://github.com/cellularjs/cellularjs/commit/490f5238286b3fdff85b51cb475de3dc4dc4d97a))


### Features

* add resolveWithTmpGlobalProviders ([ca5d11d](https://github.com/cellularjs/cellularjs/commit/ca5d11dff50c1288df0481cddfe566e0f5591689))
* allow to detect cellularjs injectable and module ([940047c](https://github.com/cellularjs/cellularjs/commit/940047cf02fd1777f5e7c19b8ab20c19ee66282d))
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
* support resolve async provider ([e1d2433](https://github.com/cellularjs/cellularjs/commit/e1d24337a859a35e1b481a48499c16e3734ff160))
