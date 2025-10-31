// calculator v1 с исправлениями
// document.addEventListener("DOMContentLoaded", () => {
//  if (document.querySelector("#calculator")) {
//      const inputs = document
//          .getElementById("calculator")
//          ?.querySelectorAll(".accordion-content input");
//      const reset_button = document.getElementById("reset-options-btn");
//      const sentButton = document.getElementById("send-calculator-total");
//      const target = document.getElementById("calculator-total-target");
//      const hash = window.location.hash;
//      const togglechange = new Event("change");

//      const formatNumber = (num) => {
//          const [integer, decimal] = num.toString().split(".");
//          const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
//          return formatted;
//      };

//      Object.defineProperty(target, "current_value", {
//          get() {
//              return this._current_value;
//          },
//          set(val) {
//              this._current_value = val;
//              this.innerText = formatNumber(val);
//          },
//          configurable: true,
//      });

//      // НОВЫЕ ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ БЛОКАМИ И СБРОСА СТОИМОСТИ
//      const showElement = (element) => {
//          if (element) element.classList.remove("hidden");
//      };

//      const hideElement = (element) => {
//          if (element) element.classList.add("hidden");
//      };

//      const showAccordionItems = (accordionItemIds) => {
//          if (!accordionItemIds) return;
//          accordionItemIds.forEach((itemId) => {
//              const item = document.getElementById(itemId);
//              showElement(item);
//          });
//      };

//      const hideAccordionItems = (accordionItemIds) => {
//          if (!accordionItemIds) return;
//          accordionItemIds.forEach((itemId) => {
//              const item = document.getElementById(itemId);
//              hideElement(item);
//          });
//      };

//      // ФУНКЦИЯ ДЛЯ СБРОСА СТОИМОСТИ ВЛОЖЕННЫХ TOGGLES ПРИ СКРЫТИИ БЛОКА
//      const resetTogglesCostInAccordionItems = (accordionItemIds, toggles, target) => {
//          if (!accordionItemIds) return;

//          accordionItemIds.forEach((accordionItemId) => {
//              const accordionItem = document.getElementById(accordionItemId);
//              if (accordionItem) {
//                  const inputsInAccordion = accordionItem.querySelectorAll("input");

//                  inputsInAccordion.forEach((input) => {
//                      if (input.type === "checkbox" && input.checked) {
//                          const toggle = toggles.find(t => t.id === input.id);
//                          if (toggle) {
//                              // Вычитаем стоимость toggle
//                              if (toggle.price) {
//                                  target.current_value -= toggle.price;
//                              }

//                              // Вычитаем стоимость nested toggles
//                              if (toggle.nested && toggle.nested.length > 0) {
//                                  toggle.nested.forEach((nestedToggleId) => {
//                                      const nestedToggle = toggles.find(t => t.id === nestedToggleId);
//                                      if (nestedToggle && nestedToggle.price) {
//                                          target.current_value -= nestedToggle.price;
//                                      }
//                                  });
//                              }

//                              // Сбрасываем состояние
//                              input.checked = false;
//                              if (toggle.reveal) {
//                                  toggle.reveal.classList.add("hidden");
//                              }
//                          }
//                      } else if (input.type === "number" && parseInt(input.value) > 0) {
//                          const counter = toggles.find(t => t.counter?.id === input.id)?.counter;
//                          if (counter && counter.total) {
//                              target.current_value -= counter.total;
//                              counter.total = 0;
//                              input.value = 0;
//                          }
//                      }
//                  });
//              }
//          });
//      };

//      // ФУНКЦИЯ ДЛЯ АКТИВАЦИИ NESTED TOGGLES БЕЗ ДВОЙНОГО УЧЕТА СТОИМОСТИ
//      const activateNestedToggles = (nestedToggleIds, toggles, target, isTypeToggle = false) => {
//          if (!nestedToggleIds) return;

//          nestedToggleIds.forEach((nestedToggleId) => {
//              const nestedToggle = toggles.find(t => t.id === nestedToggleId);
//              if (nestedToggle && !nestedToggle.elementref.checked) {
//                  // Для типов сайтов добавляем стоимость nested toggles
//                  if (isTypeToggle) {
//                      nestedToggle.elementref.checked = true;
//                      if (nestedToggle.price) {
//                          target.current_value += nestedToggle.price;
//                      }
//                      if (nestedToggle.reveal) {
//                          nestedToggle.reveal.classList.remove("hidden");
//                      }
//                  } else {
//                      // Для обычных toggles просто меняем состояние без изменения стоимости
//                      nestedToggle.elementref.checked = true;
//                      if (nestedToggle.reveal) {
//                          nestedToggle.reveal.classList.remove("hidden");
//                      }
//                  }

//                  // Активируем связанные секции
//                  const section = document.querySelector(`#section-${nestedToggleId.split("-")?.[0]}`);
//                  if (section) {
//                      section.checked = true;
//                  }
//              }
//          });
//      };

//      const handleToggleByHash = (hash, toggles) => {
//          const id = hash.replace("#", "");
//          const handle_target = toggles.find((t) => t.id === id);
//          if (handle_target) {
//              try {
//                  handle_target.elementref.checked = true;
//                  handle_target.elementref.dispatchEvent(togglechange);
//                  if (
//                      handle_target.nested &&
//                      handle_target.nested.length > 0
//                  ) {
//                      handle_target.nested.forEach((nestedToggleid) => {
//                          const nestedToggle = toggles.find(
//                              (t) => t.id === nestedToggleid
//                          );
//                          const section = document.querySelector(
//                              `#section-${nestedToggleid.split("-")?.[0]}`
//                          );
//                          section.checked = true;
//                          try {
//                              if (nestedToggle) {
//                                  nestedToggle.elementref.checked = true;
//                                  nestedToggle.elementref.dispatchEvent(
//                                      togglechange
//                                  );
//                              } else {
//                                  console.error(
//                                      "=> ",
//                                      nestedToggleid,
//                                      "not found"
//                                  );
//                              }
//                              if (nestedToggle?.reveal) {
//                                  nestedToggle.reveal.classList.remove(
//                                      "hidden"
//                                  );
//                              }
//                          } catch (err) {
//                              console.error(nestedToggleid, err);
//                          }
//                      });
//                  }
//                  console.log("=> sucess");
//              } catch (err) {
//                  console.log("=> error", err);
//              }
//          }
//      };

//      // ОБНОВЛЕН toggleConverter - ДОБАВЛЕНЫ НОВЫЕ АТРИБУТЫ
//      const toggleConverter = (inputs) => {
//          const toggles = [];
//          const counters = [];
//          const texts = [];
//          inputs.forEach((input) => {
//              switch (input.type) {
//                  case "checkbox": {
//                      toggles.push({
//                          id: input.id,
//                          elementref: input,
//                          price: parseInt(input.dataset.price || ""),
//                          nested: input.dataset.nested?.split(";"),
//                          reveal: document.getElementById(
//                              input.dataset.reveal || ""
//                          ),
//                          radioid: input.dataset.radio?.split(";"),
//                          // ДОБАВЛЕНЫ НОВЫЕ АТРИБУТЫ ДЛЯ УПРАВЛЕНИЯ БЛОКАМИ
//                          showAccordionItems: input.dataset.showAccordionItem?.split(";"),
//                          hideAccordionItems: input.dataset.hideAccordionItem?.split(";"),
//                          // ФЛАГ ДЛЯ ОПРЕДЕЛЕНИЯ ТИПА САЙТА
//                          isSiteType: input.id.startsWith('type-') || input.id.startsWith('tender-portal')
//                      });
//                      break;
//                  }
//                  case "number": {
//                      counters.push({
//                          id: input.id,
//                          elementref: input,
//                          price: parseInt(input.dataset.price),
//                          total: parseInt(input.dataset.price) * input.value,
//                          intendfor: input.dataset.intendfor,
//                      });
//                      break;
//                  }
//                  default: {
//                      texts.push({
//                          id: input.id,
//                          elementref: input,
//                      });
//                      break;
//                  }
//              }
//          });

//          toggles.forEach((toggle) => {
//              counters.forEach((counter) => {
//                  if (counter.intendfor === toggle.id) {
//                      toggle.counter = counter;
//                  }
//              });
//          });

//          return { toggles: toggles, counters: counters, texts: texts };
//      };

//      if (inputs && target) {
//          const { toggles, counters, texts } = toggleConverter(inputs);
//          target.innerText = 0;
//          target.current_value = 0;

//          toggles.forEach((toggle) => {
//              toggle.elementref.addEventListener("change", () => {
//                  switch (toggle.id) {
//                      default: {
//                          if (toggle.elementref.checked) {
//                              // СУЩЕСТВУЮЩАЯ ЛОГИКА ПОДСЧЕТА СТОИМОСТИ
//                              if (toggle.reveal) {
//                                  toggle.reveal.classList.remove("hidden");
//                              }
//                              if (toggle.counter?.total) {
//                                  target.current_value =
//                                      target.current_value +
//                                      toggle.counter.total;
//                              }
//                              if (
//                                  toggle.radioid &&
//                                  toggle.radioid.length > 0
//                              ) {
//                                  toggles.map((el) => {
//                                      toggle.radioid?.forEach((id) => {
//                                          if (el.id === id) {
//                                              if (
//                                                  el?.nested?.length > 0 &&
//                                                  el.elementref.checked
//                                              ) {
//                                                  el.nested.forEach(
//                                                      (nested) => {
//                                                          const nestedToggle =
//                                                              toggles.find(
//                                                                  (t) =>
//                                                                      t.id ===
//                                                                      nested
//                                                              );
//                                                          nestedToggle.elementref.checked = false;
//                                                          nestedToggle.reveal?.classList.add(
//                                                              "hidden"
//                                                          );
//                                                          nestedToggle.elementref.dispatchEvent(
//                                                              togglechange
//                                                          );
//                                                      }
//                                                  );
//                                              }
//                                              if (
//                                                  el.counter &&
//                                                  el.elementref.checked
//                                              ) {
//                                                  el.elementref.checked = false;
//                                                  target.current_value =
//                                                      target.current_value -
//                                                      el.price -
//                                                      el.counter.total;
//                                                  el.reveal?.classList.add(
//                                                      "hidden"
//                                                  );
//                                              } else if (
//                                                  el.elementref.checked
//                                              ) {
//                                                  target.current_value =
//                                                      target.current_value -
//                                                      el.price;
//                                                  el.elementref.checked = false;
//                                                  el.reveal?.classList.add(
//                                                      "hidden"
//                                                  );
//                                              }
//                                          }
//                                      });
//                                  });
//                              }

//                              // ИСПРАВЛЕННАЯ ЛОГИКА ДЛЯ NESTED TOGGLES
//                              if (toggle.nested && toggle.nested.length > 0) {
//                                  // Для типов сайтов используем специальную функцию активации
//                                  if (toggle.isSiteType) {
//                                      activateNestedToggles(toggle.nested, toggles, target, true);
//                                  } else {
//                                      toggle.nested.forEach((nestedToggleid) => {
//                                          const nestedToggle = toggles.find(
//                                              (t) => t.id === nestedToggleid
//                                          );
//                                          const section = document.querySelector(
//                                              `#section-${nestedToggleid.split("-")?.[0]}`
//                                          );
//                                          if (section) section.checked = true;

//                                          try {
//                                              if (nestedToggle && !nestedToggle.elementref.checked) {
//                                                  nestedToggle.elementref.checked = true;
//                                                  // Для обычных toggles не добавляем стоимость nested элементов
//                                                  if (nestedToggle?.reveal) {
//                                                      nestedToggle.reveal.classList.remove("hidden");
//                                                  }
//                                              }
//                                          } catch (err) {
//                                              console.error(nestedToggleid, err);
//                                          }
//                                      });
//                                  }
//                              }

//                              // ДОБАВЛЯЕМ СТОИМОСТЬ ОСНОВНОГО TOGGLE
//                              target.current_value = target.current_value + toggle.price;

//                              // ДОБАВЛЕНА НОВАЯ ЛОГИКА УПРАВЛЕНИЯ БЛОКАМИ
//                              if (toggle.showAccordionItems) {
//                                  showAccordionItems(toggle.showAccordionItems);
//                              }
//                              if (toggle.hideAccordionItems) {
//                                  // ПРИ СКРЫТИИ БЛОКОВ СБРАСЫВАЕМ ИХ СТОИМОСТЬ
//                                  resetTogglesCostInAccordionItems(toggle.hideAccordionItems, toggles, target);
//                                  hideAccordionItems(toggle.hideAccordionItems);
//                              }

//                              break;
//                          } else {
//                              // СУЩЕСТВУЮЩАЯ ЛОГИКА ПОДСЧЕТА СТОИМОСТИ
//                              if (toggle.reveal) {
//                                  toggle.reveal.classList.add("hidden");
//                              }
//                              if (toggle.counter?.total) {
//                                  target.current_value =
//                                      target.current_value -
//                                      toggle.counter.total;
//                              }

//                              // ИСПРАВЛЕННАЯ ЛОГИКА ДЛЯ NESTED TOGGLES ПРИ ДЕАКТИВАЦИИ
//                              if (toggle.nested && toggle.nested.length > 0) {
//                                  toggle.nested.forEach((nestedToggleid) => {
//                                      const nestedToggle = toggles.find(
//                                          (t) => t.id === nestedToggleid
//                                      );
//                                      if (nestedToggle && nestedToggle.elementref.checked) {
//                                          // Вычитаем стоимость nested toggles только для типов сайтов
//                                          if (toggle.isSiteType && nestedToggle.price) {
//                                              target.current_value -= nestedToggle.price;
//                                          }
//                                          nestedToggle.elementref.checked = false;
//                                          if (nestedToggle.reveal) {
//                                              nestedToggle.reveal.classList.add("hidden");
//                                          }
//                                      }
//                                  });
//                              }

//                              // ОБРАБОТКА PROMOTION TOGGLES
//                              if (
//                                  toggle.id === "promotion-seo" ||
//                                  toggle.id === "promotion-max_start"
//                              ) {
//                                  const inside_toggles =
//                                      toggle.reveal.querySelectorAll(
//                                          "input[type=checkbox]"
//                                      );
//                                  const new_toggleChange = new Event(
//                                      "change"
//                                  );
//                                  inside_toggles.forEach((insideToggle) => {
//                                      if (insideToggle.checked) {
//                                          const insideToggleObj = toggles.find(t => t.id === insideToggle.id);
//                                          if (insideToggleObj && insideToggleObj.price) {
//                                              target.current_value -= insideToggleObj.price;
//                                          }
//                                          insideToggle.checked = false;
//                                          try {
//                                              insideToggle.dispatchEvent(new_toggleChange);
//                                          } catch (e) {
//                                              console.log("err: ", e);
//                                          }
//                                      }
//                                  });
//                              }

//                              // ВЫЧИТАЕМ СТОИМОСТЬ ОСНОВНОГО TOGGLE
//                              const total = parseInt(target.current_value) - toggle.price;
//                              if (total < 0) {
//                                  target.current_value = 0;
//                              } else {
//                                  target.current_value = target.current_value - toggle.price;
//                              }

//                              // ДОБАВЛЕНА НОВАЯ ЛОГИКА УПРАВЛЕНИЯ БЛОКАМИ ПРИ ДЕАКТИВАЦИИ
//                              if (toggle.showAccordionItems) {
//                                  // ПРИ СКРЫТИИ БЛОКОВ СБРАСЫВАЕМ ИХ СТОИМОСТЬ
//                                  resetTogglesCostInAccordionItems(toggle.showAccordionItems, toggles, target);
//                                  hideAccordionItems(toggle.showAccordionItems);
//                              }
//                              if (toggle.hideAccordionItems) {
//                                  showAccordionItems(toggle.hideAccordionItems);
//                              }
//                              break;
//                          }
//                      }
//                  }
//              });
//          });

//          // ОСТАЛЬНОЙ КОД БЕЗ ИЗМЕНЕНИЙ
//          counters.forEach((counter) => {
//              const changeEvent = new Event("input");
//              counter.elementref.nextElementSibling?.addEventListener("click", () => {
//                  counter.elementref.value++;
//                  counter.elementref.dispatchEvent(changeEvent);
//              });
//              counter.elementref.previousElementSibling?.addEventListener("click", () => {
//                  if (counter.elementref.dataset?.intendfor === "design-landing") {
//                      if (counter.elementref.value > 1) {
//                          counter.elementref.value--;
//                      }
//                  } else if (counter.elementref.value > 0) {
//                      counter.elementref.value--;
//                  }
//                  counter.elementref.dispatchEvent(changeEvent);
//              });
//              counter.elementref.addEventListener("input", () => {
//                  target.current_value = target.current_value - counter.total;
//                  counter.total = parseInt(counter.elementref.value === "" ? "0" : counter.elementref.value) * counter.price;
//                  target.current_value = target.current_value + counter.total;
//              });
//              counter.elementref.addEventListener("keydown", (e) => {
//                  const blockedkeys = ["-", ",", ".", "+"];
//                  if (blockedkeys.includes(e.key)) {
//                      e.preventDefault();
//                  }
//              });
//              counter.elementref.addEventListener("blur", () => {
//                  if (counter.elementref.value === "") {
//                      counter.elementref.value = 0;
//                  }
//                  if (counter.elementref.dataset?.intendfor === "design-landing" && counter.elementref.value < 1) {
//                      counter.elementref.value = 1;
//                  }
//              });
//          });

//          sentButton?.addEventListener("click", () => {
//              const review = {
//                  options: toggles.filter((toggle) => toggle.elementref.checked),
//                  extra: texts.filter((text) => text.elementref.value !== ""),
//                  preprice: target.innerText,
//              };
//              console.log(review);
//          });

//          reset_button?.addEventListener("click", () => {
//              toggles.map((toggle) => {
//                  toggle.elementref.checked = false;
//              });
//              target.current_value = 0;

//              // Показываем все accordion-items при сбросе
//              const allAccordionItems = document.querySelectorAll(".accordion-item");
//              allAccordionItems.forEach(item => {
//                  item.classList.remove("hidden");
//              });
//          });

//          if (hash) {
//              handleToggleByHash(hash, toggles);
//          }
//      }
//  }
// });

// calculator v1 с исправлениями для учета счетчиков
document.addEventListener("DOMContentLoaded", () => {
	if (document.querySelector("#calculator")) {
		const inputs = document
			.getElementById("calculator")
			?.querySelectorAll(".accordion-content input");
		const reset_button = document.getElementById("reset-options-btn");
		const sentButton = document.getElementById("send-calculator-total");
		const target = document.getElementById("calculator-total-target");
		const hash = window.location.hash;
		const togglechange = new Event("change");

		const formatNumber = (num) => {
			const [integer, decimal] = num.toString().split(".");
			const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
			return formatted;
		};

		Object.defineProperty(target, "current_value", {
			get() {
				return this._current_value;
			},
			set(val) {
				this._current_value = val;
				this.innerText = formatNumber(val);
			},
			configurable: true,
		});

		// НОВЫЕ ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ БЛОКАМИ И СБРОСА СТОИМОСТИ
		const showElement = (element) => {
			if (element) element.classList.remove("hidden");
		};

		const hideElement = (element) => {
			if (element) element.classList.add("hidden");
		};

		const showAccordionItems = (accordionItemIds) => {
			if (!accordionItemIds) return;
			accordionItemIds.forEach((itemId) => {
				const item = document.getElementById(itemId);
				showElement(item);
			});
		};

		const hideAccordionItems = (accordionItemIds) => {
			if (!accordionItemIds) return;
			accordionItemIds.forEach((itemId) => {
				const item = document.getElementById(itemId);
				hideElement(item);
			});
		};

		// ФУНКЦИЯ ДЛЯ СБРОСА СТОИМОСТИ ВЛОЖЕННЫХ TOGGLES ПРИ СКРЫТИИ БЛОКА
		const resetTogglesCostInAccordionItems = (
			accordionItemIds,
			toggles,
			target
		) => {
			if (!accordionItemIds) return;

			accordionItemIds.forEach((accordionItemId) => {
				const accordionItem = document.getElementById(accordionItemId);
				if (accordionItem) {
					const inputsInAccordion =
						accordionItem.querySelectorAll("input");

					inputsInAccordion.forEach((input) => {
						if (input.type === "checkbox" && input.checked) {
							const toggle = toggles.find(
								(t) => t.id === input.id
							);
							if (toggle) {
								// Вычитаем стоимость toggle
								if (toggle.price) {
									target.current_value -= toggle.price;
								}

								// Вычитаем стоимость nested toggles
								if (toggle.nested && toggle.nested.length > 0) {
									toggle.nested.forEach((nestedToggleId) => {
										const nestedToggle = toggles.find(
											(t) => t.id === nestedToggleId
										);
										if (
											nestedToggle &&
											nestedToggle.price
										) {
											target.current_value -=
												nestedToggle.price;
										}
									});
								}

								// Сбрасываем состояние
								input.checked = false;
								if (toggle.reveal) {
									toggle.reveal.classList.add("hidden");
								}
							}
						} else if (
							input.type === "number" &&
							parseInt(input.value) > 0
						) {
							const counter = toggles.find(
								(t) => t.counter?.id === input.id
							)?.counter;
							if (counter && counter.total) {
								target.current_value -= counter.total;
								counter.total = 0;
								input.value = 0;
							}
						}
					});
				}
			});
		};

		// ФУНКЦИЯ ДЛЯ АКТИВАЦИИ NESTED TOGGLES БЕЗ ДВОЙНОГО УЧЕТА СТОИМОСТИ
		const activateNestedToggles = (
			nestedToggleIds,
			toggles,
			target,
			isTypeToggle = false
		) => {
			if (!nestedToggleIds) return;

			nestedToggleIds.forEach((nestedToggleId) => {
				const nestedToggle = toggles.find(
					(t) => t.id === nestedToggleId
				);
				if (nestedToggle && !nestedToggle.elementref.checked) {
					// Для типов сайтов добавляем стоимость nested toggles
					if (isTypeToggle) {
						nestedToggle.elementref.checked = true;
						if (nestedToggle.price) {
							target.current_value += nestedToggle.price;
						}

						// ДОБАВЛЕНО: УЧЕТ СЧЕТЧИКОВ ПРИ АКТИВАЦИИ ТИПА САЙТА
						if (nestedToggle.counter) {
							const counter = nestedToggle.counter;
							// Пересчитываем total на основе текущего значения счетчика
							counter.total =
								parseInt(counter.elementref.value || "0") *
								counter.price;
							target.current_value += counter.total;
						}

						if (nestedToggle.reveal) {
							nestedToggle.reveal.classList.remove("hidden");
						}
					} else {
						// Для обычных toggles просто меняем состояние без изменения стоимости
						nestedToggle.elementref.checked = true;
						if (nestedToggle.reveal) {
							nestedToggle.reveal.classList.remove("hidden");
						}
					}

					// Активируем связанные секции
					const section = document.querySelector(
						`#section-${nestedToggleId.split("-")?.[0]}`
					);
					if (section) {
						section.checked = true;
					}
				}
			});
		};

		// ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ СЧЕТЧИКОВ ПРИ АКТИВАЦИИ ТОГГЛОВ
		const updateCountersForToggle = (toggle, target) => {
			if (toggle.counter) {
				const counter = toggle.counter;
				// Пересчитываем total на основе текущего значения счетчика
				const currentValue = parseInt(counter.elementref.value || "0");
				counter.total = currentValue * counter.price;

				// Если toggle активирован, добавляем стоимость счетчика
				if (toggle.elementref.checked) {
					// Сначала вычитаем старую стоимость (если была), затем добавляем новую
					target.current_value += counter.total;
				}
			}
		};

		const handleToggleByHash = (hash, toggles) => {
			const id = hash.replace("#", "");
			const handle_target = toggles.find((t) => t.id === id);
			if (handle_target) {
				try {
					handle_target.elementref.checked = true;
					handle_target.elementref.dispatchEvent(togglechange);
					if (
						handle_target.nested &&
						handle_target.nested.length > 0
					) {
						handle_target.nested.forEach((nestedToggleid) => {
							const nestedToggle = toggles.find(
								(t) => t.id === nestedToggleid
							);
							const section = document.querySelector(
								`#section-${nestedToggleid.split("-")?.[0]}`
							);
							section.checked = true;
							try {
								if (nestedToggle) {
									nestedToggle.elementref.checked = true;
									nestedToggle.elementref.dispatchEvent(
										togglechange
									);
								} else {
									console.error(
										"=> ",
										nestedToggleid,
										"not found"
									);
								}
								if (nestedToggle?.reveal) {
									nestedToggle.reveal.classList.remove(
										"hidden"
									);
								}
							} catch (err) {
								console.error(nestedToggleid, err);
							}
						});
					}
					console.log("=> sucess");
				} catch (err) {
					console.log("=> error", err);
				}
			}
		};

		// ОБНОВЛЕН toggleConverter - ДОБАВЛЕНЫ НОВЫЕ АТРИБУТЫ
		const toggleConverter = (inputs) => {
			const toggles = [];
			const counters = [];
			const texts = [];
			inputs.forEach((input) => {
				switch (input.type) {
					case "checkbox": {
						toggles.push({
							id: input.id,
							elementref: input,
							price: parseInt(input.dataset.price || "0"),
							nested: input.dataset.nested?.split(";"),
							reveal: document.getElementById(
								input.dataset.reveal || ""
							),
							radioid: input.dataset.radio?.split(";"),
							// ДОБАВЛЕНЫ НОВЫЕ АТРИБУТЫ ДЛЯ УПРАВЛЕНИЯ БЛОКАМИ
							showAccordionItems:
								input.dataset.showAccordionItem?.split(";"),
							hideAccordionItems:
								input.dataset.hideAccordionItem?.split(";"),
							// ФЛАГ ДЛЯ ОПРЕДЕЛЕНИЯ ТИПА САЙТА
							isSiteType:
								input.id.startsWith("type-") ||
								input.id.startsWith("tender-portal"),
						});
						break;
					}
					case "number": {
						counters.push({
							id: input.id,
							elementref: input,
							price: parseInt(input.dataset.price || "0"),
							total:
								parseInt(input.dataset.price || "0") *
								(parseInt(input.value) || 0),
							intendfor: input.dataset.intendfor,
						});
						break;
					}
					default: {
						texts.push({
							id: input.id,
							elementref: input,
						});
						break;
					}
				}
			});

			toggles.forEach((toggle) => {
				counters.forEach((counter) => {
					if (counter.intendfor === toggle.id) {
						toggle.counter = counter;
					}
				});
			});

			return { toggles: toggles, counters: counters, texts: texts };
		};

		if (inputs && target) {
			const { toggles, counters, texts } = toggleConverter(inputs);
			target.innerText = 0;
			target.current_value = 0;

			toggles.forEach((toggle) => {
				toggle.elementref.addEventListener("change", () => {
					switch (toggle.id) {
						default: {
							if (toggle.elementref.checked) {
								// СУЩЕСТВУЮЩАЯ ЛОГИКА ПОДСЧЕТА СТОИМОСТИ
								if (toggle.reveal) {
									toggle.reveal.classList.remove("hidden");
								}

								// ИСПРАВЛЕНО: ОБНОВЛЯЕМ СЧЕТЧИК ПЕРЕД ДОБАВЛЕНИЕМ СТОИМОСТИ
								if (toggle.counter) {
									updateCountersForToggle(toggle, target);
								} else if (toggle.counter?.total) {
									target.current_value +=
										toggle.counter.total;
								}

								if (
									toggle.radioid &&
									toggle.radioid.length > 0
								) {
									toggles.map((el) => {
										toggle.radioid?.forEach((id) => {
											if (el.id === id) {
												if (
													el?.nested?.length > 0 &&
													el.elementref.checked
												) {
													el.nested.forEach(
														(nested) => {
															const nestedToggle =
																toggles.find(
																	(t) =>
																		t.id ===
																		nested
																);
															nestedToggle.elementref.checked = false;
															nestedToggle.reveal?.classList.add(
																"hidden"
															);
															nestedToggle.elementref.dispatchEvent(
																togglechange
															);
														}
													);
												}
												if (
													el.counter &&
													el.elementref.checked
												) {
													el.elementref.checked = false;
													target.current_value -=
														el.price +
														el.counter.total;
													el.reveal?.classList.add(
														"hidden"
													);
												} else if (
													el.elementref.checked
												) {
													el.elementref.checked = false;
													target.current_value -=
														el.price;
													el.reveal?.classList.add(
														"hidden"
													);
												}
											}
										});
									});
								}

								// ИСПРАВЛЕННАЯ ЛОГИКА ДЛЯ NESTED TOGGLES
								if (toggle.nested && toggle.nested.length > 0) {
									// Для типов сайтов используем специальную функцию активации
									if (toggle.isSiteType) {
										activateNestedToggles(
											toggle.nested,
											toggles,
											target,
											true
										);
									} else {
										toggle.nested.forEach(
											(nestedToggleid) => {
												const nestedToggle =
													toggles.find(
														(t) =>
															t.id ===
															nestedToggleid
													);
												const section =
													document.querySelector(
														`#section-${
															nestedToggleid.split(
																"-"
															)?.[0]
														}`
													);
												if (section)
													section.checked = true;

												try {
													if (
														nestedToggle &&
														!nestedToggle.elementref
															.checked
													) {
														nestedToggle.elementref.checked = true;
														// Для обычных toggles не добавляем стоимость nested элементов
														if (
															nestedToggle?.reveal
														) {
															nestedToggle.reveal.classList.remove(
																"hidden"
															);
														}
													}
												} catch (err) {
													console.error(
														nestedToggleid,
														err
													);
												}
											}
										);
									}
								}

								// ДОБАВЛЯЕМ СТОИМОСТЬ ОСНОВНОГО TOGGLE
								target.current_value += toggle.price;

								// ДОБАВЛЕНА НОВАЯ ЛОГИКА УПРАВЛЕНИЯ БЛОКАМИ
								if (toggle.showAccordionItems) {
									showAccordionItems(
										toggle.showAccordionItems
									);
								}
								if (toggle.hideAccordionItems) {
									// ПРИ СКРЫТИИ БЛОКОВ СБРАСЫВАЕМ ИХ СТОИМОСТЬ
									resetTogglesCostInAccordionItems(
										toggle.hideAccordionItems,
										toggles,
										target
									);
									hideAccordionItems(
										toggle.hideAccordionItems
									);
								}

								break;
							} else {
								// СУЩЕСТВУЮЩАЯ ЛОГИКА ПОДСЧЕТА СТОИМОСТИ
								if (toggle.reveal) {
									toggle.reveal.classList.add("hidden");
								}

								// ВЫЧИТАЕМ СТОИМОСТЬ СЧЕТЧИКА
								if (toggle.counter?.total) {
									target.current_value -=
										toggle.counter.total;
									// Сбрасываем total счетчика
									toggle.counter.total = 0;
								}

								// ИСПРАВЛЕННАЯ ЛОГИКА ДЛЯ NESTED TOGGLES ПРИ ДЕАКТИВАЦИИ
								if (toggle.nested && toggle.nested.length > 0) {
									toggle.nested.forEach((nestedToggleid) => {
										const nestedToggle = toggles.find(
											(t) => t.id === nestedToggleid
										);
										if (
											nestedToggle &&
											nestedToggle.elementref.checked
										) {
											// Вычитаем стоимость nested toggles только для типов сайтов
											if (
												toggle.isSiteType &&
												nestedToggle.price
											) {
												target.current_value -=
													nestedToggle.price;
											}

											// ВЫЧИТАЕМ СТОИМОСТЬ СЧЕТЧИКОВ NESTED TOGGLES
											if (
												toggle.isSiteType &&
												nestedToggle.counter?.total
											) {
												target.current_value -=
													nestedToggle.counter.total;
												nestedToggle.counter.total = 0;
											}

											nestedToggle.elementref.checked = false;
											if (nestedToggle.reveal) {
												nestedToggle.reveal.classList.add(
													"hidden"
												);
											}
										}
									});
								}

								// ОБРАБОТКА PROMOTION TOGGLES
								if (
									toggle.id === "promotion-seo" ||
									toggle.id === "promotion-max_start"
								) {
									const inside_toggles =
										toggle.reveal.querySelectorAll(
											"input[type=checkbox]"
										);
									const new_toggleChange = new Event(
										"change"
									);
									inside_toggles.forEach((insideToggle) => {
										if (insideToggle.checked) {
											const insideToggleObj =
												toggles.find(
													(t) =>
														t.id === insideToggle.id
												);
											if (
												insideToggleObj &&
												insideToggleObj.price
											) {
												target.current_value -=
													insideToggleObj.price;
											}
											insideToggle.checked = false;
											try {
												insideToggle.dispatchEvent(
													new_toggleChange
												);
											} catch (e) {
												console.log("err: ", e);
											}
										}
									});
								}

								// ВЫЧИТАЕМ СТОИМОСТЬ ОСНОВНОГО TOGGLE
								target.current_value -= toggle.price;
								if (target.current_value < 0) {
									target.current_value = 0;
								}

								// ДОБАВЛЕНА НОВАЯ ЛОГИКА УПРАВЛЕНИЯ БЛОКАМИ ПРИ ДЕАКТИВАЦИИ
								if (toggle.showAccordionItems) {
									// ПРИ СКРЫТИИ БЛОКОВ СБРАСЫВАЕМ ИХ СТОИМОСТЬ
									resetTogglesCostInAccordionItems(
										toggle.showAccordionItems,
										toggles,
										target
									);
									hideAccordionItems(
										toggle.showAccordionItems
									);
								}
								if (toggle.hideAccordionItems) {
									showAccordionItems(
										toggle.hideAccordionItems
									);
								}
								break;
							}
						}
					}
				});
			});

			// ОБРАБОТКА COUNTERS - ИСПРАВЛЕНА ДЛЯ ПРАВИЛЬНОГО УЧЕТА СТОИМОСТИ
			counters.forEach((counter) => {
				const changeEvent = new Event("input");
				counter.elementref.nextElementSibling?.addEventListener(
					"click",
					() => {
						counter.elementref.value++;
						counter.elementref.dispatchEvent(changeEvent);
					}
				);
				counter.elementref.previousElementSibling?.addEventListener(
					"click",
					() => {
						if (
							counter.elementref.dataset?.intendfor ===
							"design-landing"
						) {
							if (counter.elementref.value > 1) {
								counter.elementref.value--;
							}
						} else if (counter.elementref.value > 0) {
							counter.elementref.value--;
						}
						counter.elementref.dispatchEvent(changeEvent);
					}
				);
				counter.elementref.addEventListener("input", () => {
					// Находим связанный toggle
					const relatedToggle = toggles.find(
						(t) => t.id === counter.intendfor
					);

					if (relatedToggle && relatedToggle.elementref.checked) {
						// Если toggle активирован, обновляем стоимость
						const oldTotal = counter.total;
						counter.total =
							parseInt(
								counter.elementref.value === ""
									? "0"
									: counter.elementref.value
							) * counter.price;
						const difference = counter.total - oldTotal;
						target.current_value += difference;
					} else {
						// Если toggle не активирован, просто обновляем total
						counter.total =
							parseInt(
								counter.elementref.value === ""
									? "0"
									: counter.elementref.value
							) * counter.price;
					}
				});
				counter.elementref.addEventListener("keydown", (e) => {
					const blockedkeys = ["-", ",", ".", "+"];
					if (blockedkeys.includes(e.key)) {
						e.preventDefault();
					}
				});
				counter.elementref.addEventListener("blur", () => {
					if (counter.elementref.value === "") {
						counter.elementref.value = 0;
					}
					if (
						counter.elementref.dataset?.intendfor ===
							"design-landing" &&
						counter.elementref.value < 1
					) {
						counter.elementref.value = 1;
					}
				});
			});

			sentButton?.addEventListener("click", () => {
				const review = {
					options: toggles.filter(
						(toggle) => toggle.elementref.checked
					),
					extra: texts.filter((text) => text.elementref.value !== ""),
					preprice: target.innerText,
				};
				console.log(review);
			});

			reset_button?.addEventListener("click", () => {
				toggles.map((toggle) => {
					toggle.elementref.checked = false;
					if (toggle.counter) {
						toggle.counter.total = 0;
						toggle.counter.elementref.value = 0;
					}
				});
				target.current_value = 0;

				// Показываем все accordion-items при сбросе
				const allAccordionItems =
					document.querySelectorAll(".accordion-item");
				allAccordionItems.forEach((item) => {
					item.classList.remove("hidden");
				});
			});

			if (hash) {
				handleToggleByHash(hash, toggles);
			}
		}
	}
});

// calculator v1 с исправлениями для учета счетчиков (когда суммируются конфигурации без выбора типа сайта)
// document.addEventListener("DOMContentLoaded", () => {
// 	if (document.querySelector("#calculator")) {
// 		const inputs = document
// 			.getElementById("calculator")
// 			?.querySelectorAll(".accordion-content input");
// 		const reset_button = document.getElementById("reset-options-btn");
// 		const sentButton = document.getElementById("send-calculator-total");
// 		const target = document.getElementById("calculator-total-target");
// 		const hash = window.location.hash;
// 		const togglechange = new Event("change");

// 		const formatNumber = (num) => {
// 			const [integer, decimal] = num.toString().split(".");
// 			const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
// 			return formatted;
// 		};

// 		Object.defineProperty(target, "current_value", {
// 			get() {
// 				return this._current_value;
// 			},
// 			set(val) {
// 				this._current_value = val;
// 				this.innerText = formatNumber(val);
// 			},
// 			configurable: true,
// 		});

// 		// НОВЫЕ ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ БЛОКАМИ И СБРОСА СТОИМОСТИ
// 		const showElement = (element) => {
// 			if (element) element.classList.remove("hidden");
// 		};

// 		const hideElement = (element) => {
// 			if (element) element.classList.add("hidden");
// 		};

// 		const showAccordionItems = (accordionItemIds) => {
// 			if (!accordionItemIds) return;
// 			accordionItemIds.forEach((itemId) => {
// 				const item = document.getElementById(itemId);
// 				showElement(item);
// 			});
// 		};

// 		const hideAccordionItems = (accordionItemIds) => {
// 			if (!accordionItemIds) return;
// 			accordionItemIds.forEach((itemId) => {
// 				const item = document.getElementById(itemId);
// 				hideElement(item);
// 			});
// 		};

// 		// ФУНКЦИЯ ДЛЯ СБРОСА СТОИМОСТИ ВЛОЖЕННЫХ TOGGLES ПРИ СКРЫТИИ БЛОКА
// 		const resetTogglesCostInAccordionItems = (
// 			accordionItemIds,
// 			toggles,
// 			target
// 		) => {
// 			if (!accordionItemIds) return;

// 			accordionItemIds.forEach((accordionItemId) => {
// 				const accordionItem = document.getElementById(accordionItemId);
// 				if (accordionItem) {
// 					const inputsInAccordion =
// 						accordionItem.querySelectorAll("input");

// 					inputsInAccordion.forEach((input) => {
// 						if (input.type === "checkbox" && input.checked) {
// 							const toggle = toggles.find(
// 								(t) => t.id === input.id
// 							);
// 							if (toggle) {
// 								// Вычитаем стоимость toggle
// 								if (toggle.price) {
// 									target.current_value -= toggle.price;
// 								}

// 								// Вычитаем стоимость nested toggles
// 								if (toggle.nested && toggle.nested.length > 0) {
// 									toggle.nested.forEach((nestedToggleId) => {
// 										const nestedToggle = toggles.find(
// 											(t) => t.id === nestedToggleId
// 										);
// 										if (
// 											nestedToggle &&
// 											nestedToggle.price
// 										) {
// 											target.current_value -=
// 												nestedToggle.price;
// 										}
// 									});
// 								}

// 								// Сбрасываем состояние
// 								input.checked = false;
// 								if (toggle.reveal) {
// 									toggle.reveal.classList.add("hidden");
// 								}
// 							}
// 						} else if (
// 							input.type === "number" &&
// 							parseInt(input.value) > 0
// 						) {
// 							const counter = toggles.find(
// 								(t) => t.counter?.id === input.id
// 							)?.counter;
// 							if (counter && counter.total) {
// 								target.current_value -= counter.total;
// 								counter.total = 0;
// 								input.value = 0;
// 							}
// 						}
// 					});
// 				}
// 			});
// 		};

// 		// ФУНКЦИЯ ДЛЯ АКТИВАЦИИ NESTED TOGGLES БЕЗ ДВОЙНОГО УЧЕТА СТОИМОСТИ
// 		const activateNestedToggles = (
// 			nestedToggleIds,
// 			toggles,
// 			target,
// 			isTypeToggle = false
// 		) => {
// 			if (!nestedToggleIds) return;

// 			nestedToggleIds.forEach((nestedToggleId) => {
// 				const nestedToggle = toggles.find(
// 					(t) => t.id === nestedToggleId
// 				);
// 				if (nestedToggle && !nestedToggle.elementref.checked) {
// 					// Для типов сайтов добавляем стоимость nested toggles
// 					if (isTypeToggle) {
// 						nestedToggle.elementref.checked = true;
// 						if (nestedToggle.price) {
// 							target.current_value += nestedToggle.price;
// 						}

// 						// ДОБАВЛЕНО: УЧЕТ СЧЕТЧИКОВ ПРИ АКТИВАЦИИ ТИПА САЙТА
// 						if (nestedToggle.counter) {
// 							const counter = nestedToggle.counter;
// 							// Пересчитываем total на основе текущего значения счетчика
// 							counter.total =
// 								parseInt(counter.elementref.value || "0") *
// 								counter.price;
// 							target.current_value += counter.total;
// 						}

// 						if (nestedToggle.reveal) {
// 							nestedToggle.reveal.classList.remove("hidden");
// 						}
// 					} else {
// 						// Для обычных toggles просто меняем состояние без изменения стоимости
// 						nestedToggle.elementref.checked = true;
// 						if (nestedToggle.reveal) {
// 							nestedToggle.reveal.classList.remove("hidden");
// 						}
// 					}

// 					// Активируем связанные секции
// 					const section = document.querySelector(
// 						`#section-${nestedToggleId.split("-")?.[0]}`
// 					);
// 					if (section) {
// 						section.checked = true;
// 					}
// 				}
// 			});
// 		};

// 		// ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ СЧЕТЧИКОВ ПРИ АКТИВАЦИИ ТОГГЛОВ
// 		const updateCountersForToggle = (toggle, target) => {
// 			if (toggle.counter) {
// 				const counter = toggle.counter;
// 				// Пересчитываем total на основе текущего значения счетчика
// 				const currentValue = parseInt(counter.elementref.value || "0");
// 				counter.total = currentValue * counter.price;

// 				// Если toggle активирован, добавляем стоимость счетчика
// 				if (toggle.elementref.checked) {
// 					// Сначала вычитаем старую стоимость (если была), затем добавляем новую
// 					target.current_value += counter.total;
// 				}
// 			}
// 		};

// 		const handleToggleByHash = (hash, toggles) => {
// 			const id = hash.replace("#", "");
// 			const handle_target = toggles.find((t) => t.id === id);
// 			if (handle_target) {
// 				try {
// 					handle_target.elementref.checked = true;
// 					handle_target.elementref.dispatchEvent(togglechange);
// 					if (
// 						handle_target.nested &&
// 						handle_target.nested.length > 0
// 					) {
// 						handle_target.nested.forEach((nestedToggleid) => {
// 							const nestedToggle = toggles.find(
// 								(t) => t.id === nestedToggleid
// 							);
// 							const section = document.querySelector(
// 								`#section-${nestedToggleid.split("-")?.[0]}`
// 							);
// 							section.checked = true;
// 							try {
// 								if (nestedToggle) {
// 									nestedToggle.elementref.checked = true;
// 									nestedToggle.elementref.dispatchEvent(
// 										togglechange
// 									);
// 								} else {
// 									console.error(
// 										"=> ",
// 										nestedToggleid,
// 										"not found"
// 									);
// 								}
// 								if (nestedToggle?.reveal) {
// 									nestedToggle.reveal.classList.remove(
// 										"hidden"
// 									);
// 								}
// 							} catch (err) {
// 								console.error(nestedToggleid, err);
// 							}
// 						});
// 					}
// 					console.log("=> sucess");
// 				} catch (err) {
// 					console.log("=> error", err);
// 				}
// 			}
// 		};

// 		// ОБНОВЛЕН toggleConverter - ДОБАВЛЕНЫ НОВЫЕ АТРИБУТЫ
// 		const toggleConverter = (inputs) => {
// 			const toggles = [];
// 			const counters = [];
// 			const texts = [];
// 			inputs.forEach((input) => {
// 				switch (input.type) {
// 					case "checkbox": {
// 						toggles.push({
// 							id: input.id,
// 							elementref: input,
// 							price: parseInt(input.dataset.price || "0"),
// 							nested: input.dataset.nested?.split(";"),
// 							reveal: document.getElementById(
// 								input.dataset.reveal || ""
// 							),
// 							radioid: input.dataset.radio?.split(";"),
// 							// ДОБАВЛЕНЫ НОВЫЕ АТРИБУТЫ ДЛЯ УПРАВЛЕНИЯ БЛОКАМИ
// 							showAccordionItems:
// 								input.dataset.showAccordionItem?.split(";"),
// 							hideAccordionItems:
// 								input.dataset.hideAccordionItem?.split(";"),
// 							// ФЛАГ ДЛЯ ОПРЕДЕЛЕНИЯ ТИПА САЙТА
// 							isSiteType:
// 								input.id.startsWith("type-") ||
// 								input.id.startsWith("tender-portal") ||
// 								input.id.startsWith("tender-portal-playing"),
// 						});
// 						break;
// 					}
// 					case "number": {
// 						counters.push({
// 							id: input.id,
// 							elementref: input,
// 							price: parseInt(input.dataset.price || "0"),
// 							total:
// 								parseInt(input.dataset.price || "0") *
// 								(parseInt(input.value) || 0),
// 							intendfor: input.dataset.intendfor,
// 						});
// 						break;
// 					}
// 					default: {
// 						texts.push({
// 							id: input.id,
// 							elementref: input,
// 						});
// 						break;
// 					}
// 				}
// 			});

// 			toggles.forEach((toggle) => {
// 				counters.forEach((counter) => {
// 					if (counter.intendfor === toggle.id) {
// 						toggle.counter = counter;
// 					}
// 				});
// 			});

// 			return { toggles: toggles, counters: counters, texts: texts };
// 		};

// 		if (inputs && target) {
// 			const { toggles, counters, texts } = toggleConverter(inputs);
// 			target.innerText = 0;
// 			target.current_value = 0;

// 			toggles.forEach((toggle) => {
// 				toggle.elementref.addEventListener("change", () => {
// 					switch (toggle.id) {
// 						default: {
// 							if (toggle.elementref.checked) {
// 								// СУЩЕСТВУЮЩАЯ ЛОГИКА ПОДСЧЕТА СТОИМОСТИ
// 								if (toggle.reveal) {
// 									toggle.reveal.classList.remove("hidden");
// 								}

// 								// ИСПРАВЛЕНО: ОБНОВЛЯЕМ СЧЕТЧИК ПЕРЕД ДОБАВЛЕНИЕМ СТОИМОСТИ
// 								if (toggle.counter) {
// 									updateCountersForToggle(toggle, target);
// 								} else if (toggle.counter?.total) {
// 									target.current_value +=
// 										toggle.counter.total;
// 								}

// 								if (
// 									toggle.radioid &&
// 									toggle.radioid.length > 0
// 								) {
// 									toggles.map((el) => {
// 										toggle.radioid?.forEach((id) => {
// 											if (el.id === id) {
// 												if (
// 													el?.nested?.length > 0 &&
// 													el.elementref.checked
// 												) {
// 													el.nested.forEach(
// 														(nested) => {
// 															const nestedToggle =
// 																toggles.find(
// 																	(t) =>
// 																		t.id ===
// 																		nested
// 																);
// 															nestedToggle.elementref.checked = false;
// 															nestedToggle.reveal?.classList.add(
// 																"hidden"
// 															);
// 															nestedToggle.elementref.dispatchEvent(
// 																togglechange
// 															);
// 														}
// 													);
// 												}
// 												if (
// 													el.counter &&
// 													el.elementref.checked
// 												) {
// 													el.elementref.checked = false;
// 													target.current_value -=
// 														el.price +
// 														el.counter.total;
// 													el.reveal?.classList.add(
// 														"hidden"
// 													);
// 												} else if (
// 													el.elementref.checked
// 												) {
// 													el.elementref.checked = false;
// 													target.current_value -=
// 														el.price;
// 													el.reveal?.classList.add(
// 														"hidden"
// 													);
// 												}
// 											}
// 										});
// 									});
// 								}

// 								// ИСПРАВЛЕННАЯ ЛОГИКА ДЛЯ NESTED TOGGLES
// 								if (toggle.nested && toggle.nested.length > 0) {
// 									// Для типов сайтов используем специальную функцию активации
// 									if (toggle.isSiteType) {
// 										activateNestedToggles(
// 											toggle.nested,
// 											toggles,
// 											target,
// 											true
// 										);
// 									} else {
// 										toggle.nested.forEach(
// 											(nestedToggleid) => {
// 												const nestedToggle =
// 													toggles.find(
// 														(t) =>
// 															t.id ===
// 															nestedToggleid
// 													);
// 												const section =
// 													document.querySelector(
// 														`#section-${
// 															nestedToggleid.split(
// 																"-"
// 															)?.[0]
// 														}`
// 													);
// 												if (section)
// 													section.checked = true;

// 												try {
// 													if (
// 														nestedToggle &&
// 														!nestedToggle.elementref
// 															.checked
// 													) {
// 														nestedToggle.elementref.checked = true;
// 														// Для обычных toggles не добавляем стоимость nested элементов
// 														if (
// 															nestedToggle?.reveal
// 														) {
// 															nestedToggle.reveal.classList.remove(
// 																"hidden"
// 															);
// 														}
// 													}
// 												} catch (err) {
// 													console.error(
// 														nestedToggleid,
// 														err
// 													);
// 												}
// 											}
// 										);
// 									}
// 								}

// 								// ДОБАВЛЯЕМ СТОИМОСТЬ ОСНОВНОГО TOGGLE
// 								target.current_value += toggle.price;

// 								// ДОБАВЛЕНА НОВАЯ ЛОГИКА УПРАВЛЕНИЯ БЛОКАМИ
// 								if (toggle.showAccordionItems) {
// 									showAccordionItems(
// 										toggle.showAccordionItems
// 									);
// 								}
// 								if (toggle.hideAccordionItems) {
// 									// ПРИ СКРЫТИИ БЛОКОВ СБРАСЫВАЕМ ИХ СТОИМОСТЬ
// 									resetTogglesCostInAccordionItems(
// 										toggle.hideAccordionItems,
// 										toggles,
// 										target
// 									);
// 									hideAccordionItems(
// 										toggle.hideAccordionItems
// 									);
// 								}

// 								break;
// 							} else {
// 								// СУЩЕСТВУЮЩАЯ ЛОГИКА ПОДСЧЕТА СТОИМОСТИ
// 								if (toggle.reveal) {
// 									toggle.reveal.classList.add("hidden");
// 								}

// 								// ВЫЧИТАЕМ СТОИМОСТЬ СЧЕТЧИКА
// 								if (toggle.counter?.total) {
// 									target.current_value -=
// 										toggle.counter.total;
// 									// Сбрасываем total счетчика
// 									toggle.counter.total = 0;
// 								}

// 								// ИСПРАВЛЕННАЯ ЛОГИКА ДЛЯ NESTED TOGGLES ПРИ ДЕАКТИВАЦИИ
// 								if (toggle.nested && toggle.nested.length > 0) {
// 									toggle.nested.forEach((nestedToggleid) => {
// 										const nestedToggle = toggles.find(
// 											(t) => t.id === nestedToggleid
// 										);
// 										if (
// 											nestedToggle &&
// 											nestedToggle.elementref.checked
// 										) {
// 											// Вычитаем стоимость nested toggles только для типов сайтов
// 											if (
// 												toggle.isSiteType &&
// 												nestedToggle.price
// 											) {
// 												target.current_value -=
// 													nestedToggle.price;
// 											}

// 											// ВЫЧИТАЕМ СТОИМОСТЬ СЧЕТЧИКОВ NESTED TOGGLES
// 											if (
// 												toggle.isSiteType &&
// 												nestedToggle.counter?.total
// 											) {
// 												target.current_value -=
// 													nestedToggle.counter.total;
// 												nestedToggle.counter.total = 0;
// 											}

// 											nestedToggle.elementref.checked = false;
// 											if (nestedToggle.reveal) {
// 												nestedToggle.reveal.classList.add(
// 													"hidden"
// 												);
// 											}
// 										}
// 									});
// 								}

// 								// ОБРАБОТКА PROMOTION TOGGLES
// 								if (
// 									toggle.id === "promotion-seo" ||
// 									toggle.id === "promotion-max_start"
// 								) {
// 									const inside_toggles =
// 										toggle.reveal.querySelectorAll(
// 											"input[type=checkbox]"
// 										);
// 									const new_toggleChange = new Event(
// 										"change"
// 									);
// 									inside_toggles.forEach((insideToggle) => {
// 										if (insideToggle.checked) {
// 											const insideToggleObj =
// 												toggles.find(
// 													(t) =>
// 														t.id === insideToggle.id
// 												);
// 											if (
// 												insideToggleObj &&
// 												insideToggleObj.price
// 											) {
// 												target.current_value -=
// 													insideToggleObj.price;
// 											}
// 											insideToggle.checked = false;
// 											try {
// 												insideToggle.dispatchEvent(
// 													new_toggleChange
// 												);
// 											} catch (e) {
// 												console.log("err: ", e);
// 											}
// 										}
// 									});
// 								}

// 								// ВЫЧИТАЕМ СТОИМОСТЬ ОСНОВНОГО TOGGLE
// 								target.current_value -= toggle.price;
// 								if (target.current_value < 0) {
// 									target.current_value = 0;
// 								}

// 								// ДОБАВЛЕНА НОВАЯ ЛОГИКА УПРАВЛЕНИЯ БЛОКАМИ ПРИ ДЕАКТИВАЦИИ
// 								if (toggle.showAccordionItems) {
// 									// ПРИ СКРЫТИИ БЛОКОВ СБРАСЫВАЕМ ИХ СТОИМОСТЬ
// 									resetTogglesCostInAccordionItems(
// 										toggle.showAccordionItems,
// 										toggles,
// 										target
// 									);
// 									hideAccordionItems(
// 										toggle.showAccordionItems
// 									);
// 								}
// 								if (toggle.hideAccordionItems) {
// 									showAccordionItems(
// 										toggle.hideAccordionItems
// 									);
// 								}
// 								break;
// 							}
// 						}
// 					}
// 				});
// 			});

// 			// ОБРАБОТКА COUNTERS - ИСПРАВЛЕНА ДЛЯ ПРАВИЛЬНОГО УЧЕТА СТОИМОСТИ
// 			counters.forEach((counter) => {
// 				const changeEvent = new Event("input");
// 				counter.elementref.nextElementSibling?.addEventListener(
// 					"click",
// 					() => {
// 						counter.elementref.value++;
// 						counter.elementref.dispatchEvent(changeEvent);
// 					}
// 				);
// 				counter.elementref.previousElementSibling?.addEventListener(
// 					"click",
// 					() => {
// 						if (
// 							counter.elementref.dataset?.intendfor ===
// 							"design-landing"
// 						) {
// 							if (counter.elementref.value > 1) {
// 								counter.elementref.value--;
// 							}
// 						} else if (counter.elementref.value > 0) {
// 							counter.elementref.value--;
// 						}
// 						counter.elementref.dispatchEvent(changeEvent);
// 					}
// 				);
// 				counter.elementref.addEventListener("input", () => {
// 					// Находим связанный toggle
// 					const relatedToggle = toggles.find(
// 						(t) => t.id === counter.intendfor
// 					);

// 					if (relatedToggle && relatedToggle.elementref.checked) {
// 						// Если toggle активирован, обновляем стоимость
// 						const oldTotal = counter.total;
// 						counter.total =
// 							parseInt(
// 								counter.elementref.value === ""
// 									? "0"
// 									: counter.elementref.value
// 							) * counter.price;
// 						const difference = counter.total - oldTotal;
// 						target.current_value += difference;
// 					} else {
// 						// Если toggle не активирован, просто обновляем total
// 						counter.total =
// 							parseInt(
// 								counter.elementref.value === ""
// 									? "0"
// 									: counter.elementref.value
// 							) * counter.price;
// 					}
// 				});
// 				counter.elementref.addEventListener("keydown", (e) => {
// 					const blockedkeys = ["-", ",", ".", "+"];
// 					if (blockedkeys.includes(e.key)) {
// 						e.preventDefault();
// 					}
// 				});
// 				counter.elementref.addEventListener("blur", () => {
// 					if (counter.elementref.value === "") {
// 						counter.elementref.value = 0;
// 					}
// 					if (
// 						counter.elementref.dataset?.intendfor ===
// 							"design-landing" &&
// 						counter.elementref.value < 1
// 					) {
// 						counter.elementref.value = 1;
// 					}
// 				});
// 			});

// 			sentButton?.addEventListener("click", () => {
// 				const review = {
// 					options: toggles.filter(
// 						(toggle) => toggle.elementref.checked
// 					),
// 					extra: texts.filter((text) => text.elementref.value !== ""),
// 					preprice: target.innerText,
// 				};
// 				console.log(review);
// 			});

// 			reset_button?.addEventListener("click", () => {
// 				toggles.map((toggle) => {
// 					toggle.elementref.checked = false;
// 					if (toggle.counter) {
// 						toggle.counter.total = 0;
// 						toggle.counter.elementref.value = 0;
// 					}
// 				});
// 				target.current_value = 0;

// 				// Показываем все accordion-items при сбросе
// 				const allAccordionItems =
// 					document.querySelectorAll(".accordion-item");
// 				allAccordionItems.forEach((item) => {
// 					item.classList.remove("hidden");
// 				});
// 			});

// 			if (hash) {
// 				handleToggleByHash(hash, toggles);
// 			}
// 		}
// 	}
// });

// calculator v1 с жесткими пресетами для типов сайтов
// document.addEventListener("DOMContentLoaded", () => {
// 	if (document.querySelector("#calculator")) {
// 		const inputs = document
// 			.getElementById("calculator")
// 			?.querySelectorAll(".accordion-content input");
// 		const reset_button = document.getElementById("reset-options-btn");
// 		const sentButton = document.getElementById("send-calculator-total");
// 		const target = document.getElementById("calculator-total-target");
// 		const hash = window.location.hash;
// 		const togglechange = new Event("change");

// 		const formatNumber = (num) => {
// 			const [integer, decimal] = num.toString().split(".");
// 			const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
// 			return formatted;
// 		};

// 		Object.defineProperty(target, "current_value", {
// 			get() {
// 				return this._current_value;
// 			},
// 			set(val) {
// 				this._current_value = val;
// 				this.innerText = formatNumber(val);
// 			},
// 			configurable: true,
// 		});

// 		// ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ БЛОКАМИ
// 		const showElement = (element) => {
// 			if (element) element.classList.remove("hidden");
// 		};

// 		const hideElement = (element) => {
// 			if (element) element.classList.add("hidden");
// 		};

// 		const showAccordionItems = (accordionItemIds) => {
// 			if (!accordionItemIds) return;
// 			accordionItemIds.forEach((itemId) => {
// 				const item = document.getElementById(itemId);
// 				showElement(item);
// 			});
// 		};

// 		const hideAccordionItems = (accordionItemIds) => {
// 			if (!accordionItemIds) return;
// 			accordionItemIds.forEach((itemId) => {
// 				const item = document.getElementById(itemId);
// 				hideElement(item);
// 			});
// 		};

// 		// ФУНКЦИЯ ДЛЯ ПОЛНОГО СБРОСА КАЛЬКУЛЯТОРА
// 		const resetCalculator = (toggles, target) => {
// 			toggles.forEach((toggle) => {
// 				toggle.elementref.checked = false;
// 				if (toggle.reveal) {
// 					toggle.reveal.classList.add("hidden");
// 				}
// 				if (toggle.counter) {
// 					toggle.counter.total = 0;
// 					toggle.counter.elementref.value = 0;
// 				}
// 			});
// 			target.current_value = 0;

// 			// Показываем все accordion-items при сбросе
// 			const allAccordionItems =
// 				document.querySelectorAll(".accordion-item");
// 			allAccordionItems.forEach((item) => {
// 				item.classList.remove("hidden");
// 			});
// 		};

// 		// ФУНКЦИЯ ДЛЯ ПРИМЕНЕНИЯ ПРЕСЕТА ТИПА САЙТА
// 		const applySiteTypePreset = (selectedToggle, toggles, target) => {
// 			// Полностью сбрасываем калькулятор
// 			resetCalculator(toggles, target);

// 			// Применяем выбранный тип сайта
// 			selectedToggle.elementref.checked = true;
// 			target.current_value += selectedToggle.price;

// 			// Показываем reveal блок
// 			if (selectedToggle.reveal) {
// 				selectedToggle.reveal.classList.remove("hidden");
// 			}

// 			// Активируем все nested toggles и добавляем их стоимость
// 			if (selectedToggle.nested && selectedToggle.nested.length > 0) {
// 				selectedToggle.nested.forEach((nestedToggleId) => {
// 					const nestedToggle = toggles.find(
// 						(t) => t.id === nestedToggleId
// 					);
// 					if (nestedToggle) {
// 						nestedToggle.elementref.checked = true;
// 						target.current_value += nestedToggle.price;

// 						// Добавляем стоимость счетчиков nested toggles
// 						if (nestedToggle.counter) {
// 							const counter = nestedToggle.counter;
// 							counter.total =
// 								parseInt(counter.elementref.value || "0") *
// 								counter.price;
// 							target.current_value += counter.total;
// 						}

// 						if (nestedToggle.reveal) {
// 							nestedToggle.reveal.classList.remove("hidden");
// 						}

// 						// Активируем связанные секции
// 						const section = document.querySelector(
// 							`#section-${nestedToggleId.split("-")?.[0]}`
// 						);
// 						if (section) {
// 							section.checked = true;
// 						}
// 					}
// 				});
// 			}

// 			// Управляем блоками accordion
// 			if (selectedToggle.showAccordionItems) {
// 				showAccordionItems(selectedToggle.showAccordionItems);
// 			}
// 			if (selectedToggle.hideAccordionItems) {
// 				hideAccordionItems(selectedToggle.hideAccordionItems);
// 			}
// 		};

// 		// ФУНКЦИЯ ДЛЯ ПРОВЕРКИ, ЯВЛЯЕТСЯ ЛИ TOGGLE ВНУТРЕННИМ ДЛЯ ТЕНДЕРНОГО ПОРТАЛА
// 		const isTenderPortalInnerToggle = (toggle, toggles) => {
// 			const tenderPortalToggles = toggles.filter(
// 				(t) => t.id.startsWith("tender-portal") && t.reveal
// 			);

// 			return tenderPortalToggles.some((tenderToggle) =>
// 				tenderToggle.reveal.contains(toggle.elementref)
// 			);
// 		};

// 		// ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ СЧЕТЧИКОВ
// 		const updateCountersForToggle = (toggle, target) => {
// 			if (toggle.counter) {
// 				const counter = toggle.counter;
// 				const currentValue = parseInt(counter.elementref.value || "0");
// 				counter.total = currentValue * counter.price;

// 				if (toggle.elementref.checked) {
// 					target.current_value += counter.total;
// 				}
// 			}
// 		};

// 		const handleToggleByHash = (hash, toggles) => {
// 			const id = hash.replace("#", "");
// 			const handle_target = toggles.find((t) => t.id === id);
// 			if (handle_target) {
// 				try {
// 					handle_target.elementref.checked = true;
// 					handle_target.elementref.dispatchEvent(togglechange);
// 					if (
// 						handle_target.nested &&
// 						handle_target.nested.length > 0
// 					) {
// 						handle_target.nested.forEach((nestedToggleid) => {
// 							const nestedToggle = toggles.find(
// 								(t) => t.id === nestedToggleid
// 							);
// 							const section = document.querySelector(
// 								`#section-${nestedToggleid.split("-")?.[0]}`
// 							);
// 							if (section) section.checked = true;
// 							try {
// 								if (nestedToggle) {
// 									nestedToggle.elementref.checked = true;
// 									nestedToggle.elementref.dispatchEvent(
// 										togglechange
// 									);
// 								} else {
// 									console.error(
// 										"=> ",
// 										nestedToggleid,
// 										"not found"
// 									);
// 								}
// 								if (nestedToggle?.reveal) {
// 									nestedToggle.reveal.classList.remove(
// 										"hidden"
// 									);
// 								}
// 							} catch (err) {
// 								console.error(nestedToggleid, err);
// 							}
// 						});
// 					}
// 					console.log("=> sucess");
// 				} catch (err) {
// 					console.log("=> error", err);
// 				}
// 			}
// 		};

// 		// ОБНОВЛЕН toggleConverter
// 		const toggleConverter = (inputs) => {
// 			const toggles = [];
// 			const counters = [];
// 			const texts = [];
// 			inputs.forEach((input) => {
// 				switch (input.type) {
// 					case "checkbox": {
// 						toggles.push({
// 							id: input.id,
// 							elementref: input,
// 							price: parseInt(input.dataset.price || "0"),
// 							nested: input.dataset.nested?.split(";"),
// 							reveal: document.getElementById(
// 								input.dataset.reveal || ""
// 							),
// 							radioid: input.dataset.radio?.split(";"),
// 							showAccordionItems:
// 								input.dataset.showAccordionItem?.split(";"),
// 							hideAccordionItems:
// 								input.dataset.hideAccordionItem?.split(";"),
// 							isSiteType:
// 								input.id.startsWith("type-") ||
// 								input.id.startsWith("tender-portal") ||
// 								input.id.startsWith("tender-portal-playing"),
// 						});
// 						break;
// 					}
// 					case "number": {
// 						counters.push({
// 							id: input.id,
// 							elementref: input,
// 							price: parseInt(input.dataset.price || "0"),
// 							total:
// 								parseInt(input.dataset.price || "0") *
// 								(parseInt(input.value) || 0),
// 							intendfor: input.dataset.intendfor,
// 						});
// 						break;
// 					}
// 					default: {
// 						texts.push({
// 							id: input.id,
// 							elementref: input,
// 						});
// 						break;
// 					}
// 				}
// 			});

// 			toggles.forEach((toggle) => {
// 				counters.forEach((counter) => {
// 					if (counter.intendfor === toggle.id) {
// 						toggle.counter = counter;
// 					}
// 				});
// 			});

// 			return { toggles: toggles, counters: counters, texts: texts };
// 		};

// 		if (inputs && target) {
// 			const { toggles, counters, texts } = toggleConverter(inputs);
// 			target.innerText = 0;
// 			target.current_value = 0;

// 			toggles.forEach((toggle) => {
// 				toggle.elementref.addEventListener("change", () => {
// 					// ОСОБАЯ ЛОГИКА ДЛЯ ТИПОВ САЙТОВ
// 					if (toggle.isSiteType) {
// 						if (toggle.elementref.checked) {
// 							applySiteTypePreset(toggle, toggles, target);
// 						}
// 						// При отключении типа сайта ничего не делаем - это обрабатывается при включении нового типа
// 						return;
// 					}

// 					// ПРОВЕРЯЕМ, ЯВЛЯЕТСЯ ЛИ TOGGLE ВНУТРЕННИМ ДЛЯ ТЕНДЕРНОГО ПОРТАЛА
// 					const isTenderInnerToggle = isTenderPortalInnerToggle(
// 						toggle,
// 						toggles
// 					);

// 					// СТАНДАРТНАЯ ЛОГИКА ДЛЯ ОБЫЧНЫХ TOGGLES
// 					if (toggle.elementref.checked) {
// 						// АКТИВАЦИЯ
// 						if (toggle.reveal) {
// 							toggle.reveal.classList.remove("hidden");
// 						}

// 						// Обновляем счетчик
// 						if (toggle.counter) {
// 							updateCountersForToggle(toggle, target);
// 						}

// 						// ОБРАБОТКА RADIO ГРУПП
// 						if (toggle.radioid && toggle.radioid.length > 0) {
// 							toggle.radioid.forEach((id) => {
// 								const radioToggle = toggles.find(
// 									(t) => t.id === id
// 								);
// 								if (
// 									radioToggle &&
// 									radioToggle.elementref.checked
// 								) {
// 									// Деактивируем radio toggle
// 									radioToggle.elementref.checked = false;
// 									target.current_value -= radioToggle.price;
// 									if (radioToggle.reveal) {
// 										radioToggle.reveal.classList.add(
// 											"hidden"
// 										);
// 									}

// 									// Сбрасываем счетчики радио-элемента
// 									if (
// 										radioToggle.counter &&
// 										radioToggle.counter.total
// 									) {
// 										target.current_value -=
// 											radioToggle.counter.total;
// 										radioToggle.counter.total = 0;
// 									}

// 									// Сбрасываем nested toggles радио-элемента
// 									if (radioToggle.nested) {
// 										radioToggle.nested.forEach(
// 											(nestedId) => {
// 												const nestedToggle =
// 													toggles.find(
// 														(t) => t.id === nestedId
// 													);
// 												if (
// 													nestedToggle &&
// 													nestedToggle.elementref
// 														.checked
// 												) {
// 													nestedToggle.elementref.checked = false;
// 													target.current_value -=
// 														nestedToggle.price;
// 													if (nestedToggle.reveal) {
// 														nestedToggle.reveal.classList.add(
// 															"hidden"
// 														);
// 													}
// 												}
// 											}
// 										);
// 									}
// 								}
// 							});
// 						}

// 						// АКТИВАЦИЯ NESTED TOGGLES (БЕЗ ДОБАВЛЕНИЯ СТОИМОСТИ)
// 						if (toggle.nested && toggle.nested.length > 0) {
// 							toggle.nested.forEach((nestedToggleid) => {
// 								const nestedToggle = toggles.find(
// 									(t) => t.id === nestedToggleid
// 								);
// 								if (
// 									nestedToggle &&
// 									!nestedToggle.elementref.checked
// 								) {
// 									nestedToggle.elementref.checked = true;
// 									if (nestedToggle.reveal) {
// 										nestedToggle.reveal.classList.remove(
// 											"hidden"
// 										);
// 									}

// 									const section = document.querySelector(
// 										`#section-${
// 											nestedToggleid.split("-")?.[0]
// 										}`
// 									);
// 									if (section) section.checked = true;
// 								}
// 							});
// 						}

// 						// ДОБАВЛЯЕМ СТОИМОСТЬ ОСНОВНОГО TOGGLE
// 						target.current_value += toggle.price;

// 						// УПРАВЛЕНИЕ БЛОКАМИ - НЕ ПРИМЕНЯЕМ ДЛЯ ВНУТРЕННИХ TOGGLES ТЕНДЕРНОГО ПОРТАЛА
// 						if (!isTenderInnerToggle) {
// 							if (toggle.showAccordionItems) {
// 								showAccordionItems(toggle.showAccordionItems);
// 							}
// 							if (toggle.hideAccordionItems) {
// 								hideAccordionItems(toggle.hideAccordionItems);
// 							}
// 						}
// 					} else {
// 						// ДЕАКТИВАЦИЯ
// 						if (toggle.reveal) {
// 							toggle.reveal.classList.add("hidden");
// 						}

// 						// ВЫЧИТАЕМ СТОИМОСТЬ СЧЕТЧИКА
// 						if (toggle.counter?.total) {
// 							target.current_value -= toggle.counter.total;
// 							toggle.counter.total = 0;
// 						}

// 						// ДЕАКТИВАЦИЯ NESTED TOGGLES (БЕЗ ВЫЧИТАНИЯ СТОИМОСТИ)
// 						if (toggle.nested && toggle.nested.length > 0) {
// 							toggle.nested.forEach((nestedToggleid) => {
// 								const nestedToggle = toggles.find(
// 									(t) => t.id === nestedToggleid
// 								);
// 								if (
// 									nestedToggle &&
// 									nestedToggle.elementref.checked
// 								) {
// 									nestedToggle.elementref.checked = false;
// 									if (nestedToggle.reveal) {
// 										nestedToggle.reveal.classList.add(
// 											"hidden"
// 										);
// 									}
// 								}
// 							});
// 						}

// 						// ВЫЧИТАЕМ СТОИМОСТЬ ОСНОВНОГО TOGGLE
// 						target.current_value -= toggle.price;

// 						// УПРАВЛЕНИЕ БЛОКАМИ ПРИ ДЕАКТИВАЦИИ - НЕ ПРИМЕНЯЕМ ДЛЯ ВНУТРЕННИХ TOGGLES ТЕНДЕРНОГО ПОРТАЛА
// 						if (!isTenderInnerToggle) {
// 							if (toggle.showAccordionItems) {
// 								hideAccordionItems(toggle.showAccordionItems);
// 							}
// 							if (toggle.hideAccordionItems) {
// 								showAccordionItems(toggle.hideAccordionItems);
// 							}
// 						}
// 					}

// 					// Гарантируем, что стоимость не станет отрицательной
// 					if (target.current_value < 0) {
// 						target.current_value = 0;
// 					}
// 				});
// 			});

// 			// ОБРАБОТКА COUNTERS
// 			counters.forEach((counter) => {
// 				const changeEvent = new Event("input");
// 				counter.elementref.nextElementSibling?.addEventListener(
// 					"click",
// 					() => {
// 						counter.elementref.value++;
// 						counter.elementref.dispatchEvent(changeEvent);
// 					}
// 				);
// 				counter.elementref.previousElementSibling?.addEventListener(
// 					"click",
// 					() => {
// 						if (
// 							counter.elementref.dataset?.intendfor ===
// 							"design-landing"
// 						) {
// 							if (counter.elementref.value > 1) {
// 								counter.elementref.value--;
// 							}
// 						} else if (counter.elementref.value > 0) {
// 							counter.elementref.value--;
// 						}
// 						counter.elementref.dispatchEvent(changeEvent);
// 					}
// 				);
// 				counter.elementref.addEventListener("input", () => {
// 					// Находим связанный toggle
// 					const relatedToggle = toggles.find(
// 						(t) => t.id === counter.intendfor
// 					);

// 					if (relatedToggle && relatedToggle.elementref.checked) {
// 						// Если toggle активирован, обновляем стоимость
// 						const oldTotal = counter.total;
// 						counter.total =
// 							parseInt(
// 								counter.elementref.value === ""
// 									? "0"
// 									: counter.elementref.value
// 							) * counter.price;
// 						const difference = counter.total - oldTotal;
// 						target.current_value += difference;
// 					} else {
// 						// Если toggle не активирован, просто обновляем total
// 						counter.total =
// 							parseInt(
// 								counter.elementref.value === ""
// 									? "0"
// 									: counter.elementref.value
// 							) * counter.price;
// 					}

// 					// Гарантируем, что стоимость не станет отрицательной
// 					if (target.current_value < 0) {
// 						target.current_value = 0;
// 					}
// 				});
// 				counter.elementref.addEventListener("keydown", (e) => {
// 					const blockedkeys = ["-", ",", ".", "+"];
// 					if (blockedkeys.includes(e.key)) {
// 						e.preventDefault();
// 					}
// 				});
// 				counter.elementref.addEventListener("blur", () => {
// 					if (counter.elementref.value === "") {
// 						counter.elementref.value = 0;
// 					}
// 					if (
// 						counter.elementref.dataset?.intendfor ===
// 							"design-landing" &&
// 						counter.elementref.value < 1
// 					) {
// 						counter.elementref.value = 1;
// 					}
// 				});
// 			});

// 			sentButton?.addEventListener("click", () => {
// 				const review = {
// 					options: toggles.filter(
// 						(toggle) => toggle.elementref.checked
// 					),
// 					extra: texts.filter((text) => text.elementref.value !== ""),
// 					preprice: target.innerText,
// 				};
// 				console.log(review);
// 			});

// 			reset_button?.addEventListener("click", () => {
// 				resetCalculator(toggles, target);
// 			});

// 			if (hash) {
// 				handleToggleByHash(hash, toggles);
// 			}
// 		}
// 	}
// });

// calculator v1 с жесткими пресетами для типов сайтов
// document.addEventListener("DOMContentLoaded", () => {
// 	if (document.querySelector("#calculator")) {
// 		const inputs = document
// 			.getElementById("calculator")
// 			?.querySelectorAll(".accordion-content input");
// 		const reset_button = document.getElementById("reset-options-btn");
// 		const sentButton = document.getElementById("send-calculator-total");
// 		const target = document.getElementById("calculator-total-target");
// 		const hash = window.location.hash;
// 		const togglechange = new Event("change");

// 		const formatNumber = (num) => {
// 			const [integer, decimal] = num.toString().split(".");
// 			const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
// 			return formatted;
// 		};

// 		Object.defineProperty(target, "current_value", {
// 			get() {
// 				return this._current_value;
// 			},
// 			set(val) {
// 				this._current_value = val;
// 				this.innerText = formatNumber(val);
// 			},
// 			configurable: true,
// 		});

// 		// ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ БЛОКАМИ
// 		const showElement = (element) => {
// 			if (element) element.classList.remove("hidden");
// 		};

// 		const hideElement = (element) => {
// 			if (element) element.classList.add("hidden");
// 		};

// 		const showAccordionItems = (accordionItemIds) => {
// 			if (!accordionItemIds) return;
// 			accordionItemIds.forEach((itemId) => {
// 				const item = document.getElementById(itemId);
// 				showElement(item);
// 			});
// 		};

// 		const hideAccordionItems = (accordionItemIds) => {
// 			if (!accordionItemIds) return;
// 			accordionItemIds.forEach((itemId) => {
// 				const item = document.getElementById(itemId);
// 				hideElement(item);
// 			});
// 		};

// 		// ФУНКЦИЯ ДЛЯ ПОЛНОГО СБРОСА КАЛЬКУЛЯТОРА
// 		const resetCalculator = (toggles, target) => {
// 			toggles.forEach((toggle) => {
// 				toggle.elementref.checked = false;
// 				if (toggle.reveal) {
// 					toggle.reveal.classList.add("hidden");
// 				}
// 				if (toggle.counter) {
// 					toggle.counter.total = 0;
// 					toggle.counter.elementref.value = 0;
// 				}
// 			});
// 			target.current_value = 0;

// 			// Показываем все accordion-items при сбросе
// 			const allAccordionItems =
// 				document.querySelectorAll(".accordion-item");
// 			allAccordionItems.forEach((item) => {
// 				item.classList.remove("hidden");
// 			});
// 		};

// 		// ФУНКЦИЯ ДЛЯ ПРИМЕНЕНИЯ ПРЕСЕТА ТИПА САЙТА
// 		const applySiteTypePreset = (selectedToggle, toggles, target) => {
// 			// Полностью сбрасываем калькулятор
// 			resetCalculator(toggles, target);

// 			// Применяем выбранный тип сайта
// 			selectedToggle.elementref.checked = true;
// 			target.current_value += selectedToggle.price;

// 			// Показываем reveal блок
// 			if (selectedToggle.reveal) {
// 				selectedToggle.reveal.classList.remove("hidden");
// 			}

// 			// Активируем все nested toggles и добавляем их стоимость
// 			if (selectedToggle.nested && selectedToggle.nested.length > 0) {
// 				selectedToggle.nested.forEach((nestedToggleId) => {
// 					const nestedToggle = toggles.find(
// 						(t) => t.id === nestedToggleId
// 					);
// 					if (nestedToggle) {
// 						nestedToggle.elementref.checked = true;
// 						target.current_value += nestedToggle.price;

// 						// Добавляем стоимость счетчиков nested toggles
// 						if (nestedToggle.counter) {
// 							const counter = nestedToggle.counter;
// 							counter.total =
// 								parseInt(counter.elementref.value || "0") *
// 								counter.price;
// 							target.current_value += counter.total;
// 						}

// 						if (nestedToggle.reveal) {
// 							nestedToggle.reveal.classList.remove("hidden");
// 						}

// 						// Активируем связанные секции
// 						const section = document.querySelector(
// 							`#section-${nestedToggleId.split("-")?.[0]}`
// 						);
// 						if (section) {
// 							section.checked = true;
// 						}
// 					}
// 				});
// 			}

// 			// Управляем блоками accordion
// 			if (selectedToggle.showAccordionItems) {
// 				showAccordionItems(selectedToggle.showAccordionItems);
// 			}
// 			if (selectedToggle.hideAccordionItems) {
// 				hideAccordionItems(selectedToggle.hideAccordionItems);
// 			}
// 		};

// 		// ФУНКЦИЯ ДЛЯ ПРОВЕРКИ, ЯВЛЯЕТСЯ ЛИ TOGGLE ВНУТРЕННИМ ДЛЯ ТЕНДЕРНОГО ПОРТАЛА
// 		const isTenderPortalInnerToggle = (toggle) => {
// 			const tenderPortalConfigs = [
// 				"tender-portal_config",
// 				"tender-portal_paying_config",
// 			];

// 			return tenderPortalConfigs.some((configId) => {
// 				const configElement = document.getElementById(configId);
// 				return (
// 					configElement && configElement.contains(toggle.elementref)
// 				);
// 			});
// 		};

// 		// ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ СЧЕТЧИКОВ
// 		const updateCountersForToggle = (toggle, target) => {
// 			if (toggle.counter) {
// 				const counter = toggle.counter;
// 				const currentValue = parseInt(counter.elementref.value || "0");
// 				counter.total = currentValue * counter.price;

// 				if (toggle.elementref.checked) {
// 					target.current_value += counter.total;
// 				}
// 			}
// 		};

// 		const handleToggleByHash = (hash, toggles) => {
// 			const id = hash.replace("#", "");
// 			const handle_target = toggles.find((t) => t.id === id);
// 			if (handle_target) {
// 				try {
// 					handle_target.elementref.checked = true;
// 					handle_target.elementref.dispatchEvent(togglechange);
// 					if (
// 						handle_target.nested &&
// 						handle_target.nested.length > 0
// 					) {
// 						handle_target.nested.forEach((nestedToggleid) => {
// 							const nestedToggle = toggles.find(
// 								(t) => t.id === nestedToggleid
// 							);
// 							const section = document.querySelector(
// 								`#section-${nestedToggleid.split("-")?.[0]}`
// 							);
// 							if (section) section.checked = true;
// 							try {
// 								if (nestedToggle) {
// 									nestedToggle.elementref.checked = true;
// 									nestedToggle.elementref.dispatchEvent(
// 										togglechange
// 									);
// 								} else {
// 									console.error(
// 										"=> ",
// 										nestedToggleid,
// 										"not found"
// 									);
// 								}
// 								if (nestedToggle?.reveal) {
// 									nestedToggle.reveal.classList.remove(
// 										"hidden"
// 									);
// 								}
// 							} catch (err) {
// 								console.error(nestedToggleid, err);
// 							}
// 						});
// 					}
// 					console.log("=> sucess");
// 				} catch (err) {
// 					console.log("=> error", err);
// 				}
// 			}
// 		};

// 		// ОБНОВЛЕН toggleConverter
// 		const toggleConverter = (inputs) => {
// 			const toggles = [];
// 			const counters = [];
// 			const texts = [];
// 			inputs.forEach((input) => {
// 				switch (input.type) {
// 					case "checkbox": {
// 						toggles.push({
// 							id: input.id,
// 							elementref: input,
// 							price: parseInt(input.dataset.price || "0"),
// 							nested: input.dataset.nested?.split(";"),
// 							reveal: document.getElementById(
// 								input.dataset.reveal || ""
// 							),
// 							radioid: input.dataset.radio?.split(";"),
// 							showAccordionItems:
// 								input.dataset.showAccordionItem?.split(";"),
// 							hideAccordionItems:
// 								input.dataset.hideAccordionItem?.split(";"),
// 							isSiteType:
// 								input.id.startsWith("type-") ||
// 								input.id.startsWith("tender-portal") ||
// 								input.id.startsWith("tender-portal-paying"),
// 						});
// 						break;
// 					}
// 					case "number": {
// 						counters.push({
// 							id: input.id,
// 							elementref: input,
// 							price: parseInt(input.dataset.price || "0"),
// 							total:
// 								parseInt(input.dataset.price || "0") *
// 								(parseInt(input.value) || 0),
// 							intendfor: input.dataset.intendfor,
// 						});
// 						break;
// 					}
// 					default: {
// 						texts.push({
// 							id: input.id,
// 							elementref: input,
// 						});
// 						break;
// 					}
// 				}
// 			});

// 			toggles.forEach((toggle) => {
// 				counters.forEach((counter) => {
// 					if (counter.intendfor === toggle.id) {
// 						toggle.counter = counter;
// 					}
// 				});
// 			});

// 			return { toggles: toggles, counters: counters, texts: texts };
// 		};

// 		if (inputs && target) {
// 			const { toggles, counters, texts } = toggleConverter(inputs);
// 			target.innerText = 0;
// 			target.current_value = 0;

// 			toggles.forEach((toggle) => {
// 				toggle.elementref.addEventListener("change", () => {
// 					// ОСОБАЯ ЛОГИКА ДЛЯ ТИПОВ САЙТОВ
// 					if (toggle.isSiteType) {
// 						if (toggle.elementref.checked) {
// 							applySiteTypePreset(toggle, toggles, target);
// 						}
// 						// При отключении типа сайта ничего не делаем - это обрабатывается при включении нового типа
// 						return;
// 					}

// 					// ПРОВЕРЯЕМ, ЯВЛЯЕТСЯ ЛИ TOGGLE ВНУТРЕННИМ ДЛЯ ТЕНДЕРНОГО ПОРТАЛА
// 					const isTenderInnerToggle =
// 						isTenderPortalInnerToggle(toggle);

// 					// СТАНДАРТНАЯ ЛОГИКА ДЛЯ ОБЫЧНЫХ TOGGLES
// 					if (toggle.elementref.checked) {
// 						// АКТИВАЦИЯ
// 						if (toggle.reveal) {
// 							toggle.reveal.classList.remove("hidden");
// 						}

// 						// Обновляем счетчик
// 						if (toggle.counter) {
// 							updateCountersForToggle(toggle, target);
// 						}

// 						// ОБРАБОТКА RADIO ГРУПП
// 						if (toggle.radioid && toggle.radioid.length > 0) {
// 							toggle.radioid.forEach((id) => {
// 								const radioToggle = toggles.find(
// 									(t) => t.id === id
// 								);
// 								if (
// 									radioToggle &&
// 									radioToggle.elementref.checked
// 								) {
// 									// Деактивируем radio toggle
// 									radioToggle.elementref.checked = false;
// 									target.current_value -= radioToggle.price;
// 									if (radioToggle.reveal) {
// 										radioToggle.reveal.classList.add(
// 											"hidden"
// 										);
// 									}

// 									// Сбрасываем счетчики радио-элемента
// 									if (
// 										radioToggle.counter &&
// 										radioToggle.counter.total
// 									) {
// 										target.current_value -=
// 											radioToggle.counter.total;
// 										radioToggle.counter.total = 0;
// 									}

// 									// Сбрасываем nested toggles радио-элемента
// 									if (radioToggle.nested) {
// 										radioToggle.nested.forEach(
// 											(nestedId) => {
// 												const nestedToggle =
// 													toggles.find(
// 														(t) => t.id === nestedId
// 													);
// 												if (
// 													nestedToggle &&
// 													nestedToggle.elementref
// 														.checked
// 												) {
// 													nestedToggle.elementref.checked = false;
// 													target.current_value -=
// 														nestedToggle.price;
// 													if (nestedToggle.reveal) {
// 														nestedToggle.reveal.classList.add(
// 															"hidden"
// 														);
// 													}
// 												}
// 											}
// 										);
// 									}
// 								}
// 							});
// 						}

// 						// АКТИВАЦИЯ NESTED TOGGLES (БЕЗ ДОБАВЛЕНИЯ СТОИМОСТИ)
// 						if (toggle.nested && toggle.nested.length > 0) {
// 							toggle.nested.forEach((nestedToggleid) => {
// 								const nestedToggle = toggles.find(
// 									(t) => t.id === nestedToggleid
// 								);
// 								if (
// 									nestedToggle &&
// 									!nestedToggle.elementref.checked
// 								) {
// 									nestedToggle.elementref.checked = true;
// 									if (nestedToggle.reveal) {
// 										nestedToggle.reveal.classList.remove(
// 											"hidden"
// 										);
// 									}

// 									const section = document.querySelector(
// 										`#section-${
// 											nestedToggleid.split("-")?.[0]
// 										}`
// 									);
// 									if (section) section.checked = true;
// 								}
// 							});
// 						}

// 						// ДОБАВЛЯЕМ СТОИМОСТЬ ОСНОВНОГО TOGGLE
// 						target.current_value += toggle.price;

// 						// УПРАВЛЕНИЕ БЛОКАМИ - НЕ ПРИМЕНЯЕМ ДЛЯ ВНУТРЕННИХ TOGGLES ТЕНДЕРНОГО ПОРТАЛА
// 						if (!isTenderInnerToggle) {
// 							if (toggle.showAccordionItems) {
// 								showAccordionItems(toggle.showAccordionItems);
// 							}
// 							if (toggle.hideAccordionItems) {
// 								hideAccordionItems(toggle.hideAccordionItems);
// 							}
// 						}
// 					} else {
// 						// ДЕАКТИВАЦИЯ
// 						if (toggle.reveal) {
// 							toggle.reveal.classList.add("hidden");
// 						}

// 						// ВЫЧИТАЕМ СТОИМОСТЬ СЧЕТЧИКА
// 						if (toggle.counter?.total) {
// 							target.current_value -= toggle.counter.total;
// 							toggle.counter.total = 0;
// 						}

// 						// ДЕАКТИВАЦИЯ NESTED TOGGLES (БЕЗ ВЫЧИТАНИЯ СТОИМОСТИ)
// 						if (toggle.nested && toggle.nested.length > 0) {
// 							toggle.nested.forEach((nestedToggleid) => {
// 								const nestedToggle = toggles.find(
// 									(t) => t.id === nestedToggleid
// 								);
// 								if (
// 									nestedToggle &&
// 									nestedToggle.elementref.checked
// 								) {
// 									nestedToggle.elementref.checked = false;
// 									if (nestedToggle.reveal) {
// 										nestedToggle.reveal.classList.add(
// 											"hidden"
// 										);
// 									}
// 								}
// 							});
// 						}

// 						// ВЫЧИТАЕМ СТОИМОСТЬ ОСНОВНОГО TOGGLE
// 						target.current_value -= toggle.price;

// 						// УПРАВЛЕНИЕ БЛОКАМИ ПРИ ДЕАКТИВАЦИИ - НЕ ПРИМЕНЯЕМ ДЛЯ ВНУТРЕННИХ TOGGLES ТЕНДЕРНОГО ПОРТАЛА
// 						if (!isTenderInnerToggle) {
// 							if (toggle.showAccordionItems) {
// 								hideAccordionItems(toggle.showAccordionItems);
// 							}
// 							if (toggle.hideAccordionItems) {
// 								showAccordionItems(toggle.hideAccordionItems);
// 							}
// 						}
// 					}

// 					// Гарантируем, что стоимость не станет отрицательной
// 					if (target.current_value < 0) {
// 						target.current_value = 0;
// 					}
// 				});
// 			});

// 			// ОБРАБОТКА COUNTERS
// 			counters.forEach((counter) => {
// 				const changeEvent = new Event("input");
// 				counter.elementref.nextElementSibling?.addEventListener(
// 					"click",
// 					() => {
// 						counter.elementref.value++;
// 						counter.elementref.dispatchEvent(changeEvent);
// 					}
// 				);
// 				counter.elementref.previousElementSibling?.addEventListener(
// 					"click",
// 					() => {
// 						if (
// 							counter.elementref.dataset?.intendfor ===
// 							"design-landing"
// 						) {
// 							if (counter.elementref.value > 1) {
// 								counter.elementref.value--;
// 							}
// 						} else if (counter.elementref.value > 0) {
// 							counter.elementref.value--;
// 						}
// 						counter.elementref.dispatchEvent(changeEvent);
// 					}
// 				);
// 				counter.elementref.addEventListener("input", () => {
// 					// Находим связанный toggle
// 					const relatedToggle = toggles.find(
// 						(t) => t.id === counter.intendfor
// 					);

// 					if (relatedToggle && relatedToggle.elementref.checked) {
// 						// Если toggle активирован, обновляем стоимость
// 						const oldTotal = counter.total;
// 						counter.total =
// 							parseInt(
// 								counter.elementref.value === ""
// 									? "0"
// 									: counter.elementref.value
// 							) * counter.price;
// 						const difference = counter.total - oldTotal;
// 						target.current_value += difference;
// 					} else {
// 						// Если toggle не активирован, просто обновляем total
// 						counter.total =
// 							parseInt(
// 								counter.elementref.value === ""
// 									? "0"
// 									: counter.elementref.value
// 							) * counter.price;
// 					}

// 					// Гарантируем, что стоимость не станет отрицательной
// 					if (target.current_value < 0) {
// 						target.current_value = 0;
// 					}
// 				});
// 				counter.elementref.addEventListener("keydown", (e) => {
// 					const blockedkeys = ["-", ",", ".", "+"];
// 					if (blockedkeys.includes(e.key)) {
// 						e.preventDefault();
// 					}
// 				});
// 				counter.elementref.addEventListener("blur", () => {
// 					if (counter.elementref.value === "") {
// 						counter.elementref.value = 0;
// 					}
// 					if (
// 						counter.elementref.dataset?.intendfor ===
// 							"design-landing" &&
// 						counter.elementref.value < 1
// 					) {
// 						counter.elementref.value = 1;
// 					}
// 				});
// 			});

// 			sentButton?.addEventListener("click", () => {
// 				const review = {
// 					options: toggles.filter(
// 						(toggle) => toggle.elementref.checked
// 					),
// 					extra: texts.filter((text) => text.elementref.value !== ""),
// 					preprice: target.innerText,
// 				};
// 				console.log(review);
// 			});

// 			reset_button?.addEventListener("click", () => {
// 				resetCalculator(toggles, target);
// 			});

// 			if (hash) {
// 				handleToggleByHash(hash, toggles);
// 			}
// 		}
// 	}
// });

// calculator v1 с жесткими пресетами для типов сайтов
document.addEventListener("DOMContentLoaded", () => {
	if (document.querySelector("#calculator")) {
		const inputs = document
			.getElementById("calculator")
			?.querySelectorAll(".accordion-content input");
		const reset_button = document.getElementById("reset-options-btn");
		const sentButton = document.getElementById("send-calculator-total");
		const target = document.getElementById("calculator-total-target");
		const hash = window.location.hash;
		const togglechange = new Event("change");

		const formatNumber = (num) => {
			const [integer, decimal] = num.toString().split(".");
			const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
			return formatted;
		};

		Object.defineProperty(target, "current_value", {
			get() {
				return this._current_value;
			},
			set(val) {
				this._current_value = val;
				this.innerText = formatNumber(val);
			},
			configurable: true,
		});

		// ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ БЛОКАМИ
		const showElement = (element) => {
			if (element) element.classList.remove("hidden");
		};

		const hideElement = (element) => {
			if (element) element.classList.add("hidden");
		};

		const showAccordionItems = (accordionItemIds) => {
			if (!accordionItemIds) return;
			accordionItemIds.forEach((itemId) => {
				const item = document.getElementById(itemId);
				showElement(item);
			});
		};

		const hideAccordionItems = (accordionItemIds) => {
			if (!accordionItemIds) return;
			accordionItemIds.forEach((itemId) => {
				const item = document.getElementById(itemId);
				hideElement(item);
			});
		};

		// ФУНКЦИЯ ДЛЯ ПОЛНОГО СБРОСА КАЛЬКУЛЯТОРА
		const resetCalculator = (toggles, target) => {
			toggles.forEach((toggle) => {
				toggle.elementref.checked = false;
				if (toggle.reveal) {
					toggle.reveal.classList.add("hidden");
				}
				if (toggle.counter) {
					toggle.counter.total = 0;
					toggle.counter.elementref.value = 0;
				}
			});
			target.current_value = 0;

			// Показываем все accordion-items при сбросе
			const allAccordionItems =
				document.querySelectorAll(".accordion-item");
			allAccordionItems.forEach((item) => {
				item.classList.remove("hidden");
			});
		};

		// ФУНКЦИЯ ДЛЯ ПРИМЕНЕНИЯ ПРЕСЕТА ТИПА САЙТА
		const applySiteTypePreset = (selectedToggle, toggles, target) => {
			// Полностью сбрасываем калькулятор
			resetCalculator(toggles, target);

			// Применяем выбранный тип сайта
			selectedToggle.elementref.checked = true;
			target.current_value += selectedToggle.price;

			// Показываем reveal блок
			if (selectedToggle.reveal) {
				selectedToggle.reveal.classList.remove("hidden");
			}

			// Активируем все nested toggles и добавляем их стоимость
			if (selectedToggle.nested && selectedToggle.nested.length > 0) {
				selectedToggle.nested.forEach((nestedToggleId) => {
					const nestedToggle = toggles.find(
						(t) => t.id === nestedToggleId
					);
					if (nestedToggle) {
						nestedToggle.elementref.checked = true;
						target.current_value += nestedToggle.price;

						// Добавляем стоимость счетчиков nested toggles
						if (nestedToggle.counter) {
							const counter = nestedToggle.counter;
							counter.total =
								parseInt(counter.elementref.value || "0") *
								counter.price;
							target.current_value += counter.total;
						}

						if (nestedToggle.reveal) {
							nestedToggle.reveal.classList.remove("hidden");
						}

						// Активируем связанные секции
						const section = document.querySelector(
							`#section-${nestedToggleId.split("-")?.[0]}`
						);
						if (section) {
							section.checked = true;
						}
					}
				});
			}

			// Управляем блоками accordion
			if (selectedToggle.showAccordionItems) {
				showAccordionItems(selectedToggle.showAccordionItems);
			}
			if (selectedToggle.hideAccordionItems) {
				hideAccordionItems(selectedToggle.hideAccordionItems);
			}
		};

		// ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ СЧЕТЧИКОВ
		const updateCountersForToggle = (toggle, target) => {
			if (toggle.counter) {
				const counter = toggle.counter;
				const currentValue = parseInt(counter.elementref.value || "0");
				counter.total = currentValue * counter.price;

				if (toggle.elementref.checked) {
					target.current_value += counter.total;
				}
			}
		};

		// ФУНКЦИЯ ДЛЯ ПРОВЕРКИ, ЯВЛЯЕТСЯ ЛИ TOGGLE ВНУТРЕННИМ ДЛЯ ТЕНДЕРНОГО ПОРТАЛА
		const isTenderPortalInnerToggle = (toggle) => {
			const tenderConfigIds = [
				"tender-portal_config",
				"tender-portal_paying_config",
			];

			for (const configId of tenderConfigIds) {
				const configElement = document.getElementById(configId);
				if (
					configElement &&
					configElement.contains(toggle.elementref)
				) {
					return true;
				}
			}
			return false;
		};

		const handleToggleByHash = (hash, toggles) => {
			const id = hash.replace("#", "");
			const handle_target = toggles.find((t) => t.id === id);
			if (handle_target) {
				try {
					handle_target.elementref.checked = true;
					handle_target.elementref.dispatchEvent(togglechange);
					if (
						handle_target.nested &&
						handle_target.nested.length > 0
					) {
						handle_target.nested.forEach((nestedToggleid) => {
							const nestedToggle = toggles.find(
								(t) => t.id === nestedToggleid
							);
							const section = document.querySelector(
								`#section-${nestedToggleid.split("-")?.[0]}`
							);
							if (section) section.checked = true;
							try {
								if (nestedToggle) {
									nestedToggle.elementref.checked = true;
									nestedToggle.elementref.dispatchEvent(
										togglechange
									);
								} else {
									console.error(
										"=> ",
										nestedToggleid,
										"not found"
									);
								}
								if (nestedToggle?.reveal) {
									nestedToggle.reveal.classList.remove(
										"hidden"
									);
								}
							} catch (err) {
								console.error(nestedToggleid, err);
							}
						});
					}
					console.log("=> sucess");
				} catch (err) {
					console.log("=> error", err);
				}
			}
		};

		// ОБНОВЛЕН toggleConverter - УТОЧНЕННАЯ ЛОГИКА ДЛЯ isSiteType
		const toggleConverter = (inputs) => {
			const toggles = [];
			const counters = [];
			const texts = [];

			// Определяем основные типы сайтов
			const mainSiteTypes = [
				"type-landing",
				"type-portfolio",
				"type-corporate",
				"type-corporate_catalogue",
				"type-store",
				"type-store_ai",
				"type-portal",
				"tender-portal",
				"tender-portal-paying",
				"type-unique",
			];

			inputs.forEach((input) => {
				switch (input.type) {
					case "checkbox": {
						// Проверяем, является ли это основным типом сайта
						const isMainSiteType = mainSiteTypes.includes(input.id);

						toggles.push({
							id: input.id,
							elementref: input,
							price: parseInt(input.dataset.price || "0"),
							nested: input.dataset.nested?.split(";"),
							reveal: document.getElementById(
								input.dataset.reveal || ""
							),
							radioid: input.dataset.radio?.split(";"),
							showAccordionItems:
								input.dataset.showAccordionItem?.split(";"),
							hideAccordionItems:
								input.dataset.hideAccordionItem?.split(";"),
							isSiteType: isMainSiteType,
						});
						break;
					}
					case "number": {
						counters.push({
							id: input.id,
							elementref: input,
							price: parseInt(input.dataset.price || "0"),
							total:
								parseInt(input.dataset.price || "0") *
								(parseInt(input.value) || 0),
							intendfor: input.dataset.intendfor,
						});
						break;
					}
					default: {
						texts.push({
							id: input.id,
							elementref: input,
						});
						break;
					}
				}
			});

			toggles.forEach((toggle) => {
				counters.forEach((counter) => {
					if (counter.intendfor === toggle.id) {
						toggle.counter = counter;
					}
				});
			});

			return { toggles: toggles, counters: counters, texts: texts };
		};

		if (inputs && target) {
			const { toggles, counters, texts } = toggleConverter(inputs);
			target.innerText = 0;
			target.current_value = 0;

			toggles.forEach((toggle) => {
				toggle.elementref.addEventListener("change", () => {
					// ОСОБАЯ ЛОГИКА ДЛЯ ТИПОВ САЙТОВ
					if (toggle.isSiteType) {
						if (toggle.elementref.checked) {
							applySiteTypePreset(toggle, toggles, target);
						} else {
							resetCalculator(toggles, target);
						}

						// При отключении типа сайта ничего не делаем - это обрабатывается при включении нового типа
						return;
					}

					// ПРОВЕРЯЕМ, ЯВЛЯЕТСЯ ЛИ TOGGLE ВНУТРЕННИМ ДЛЯ ТЕНДЕРНОГО ПОРТАЛА
					const isTenderInnerToggle =
						isTenderPortalInnerToggle(toggle);

					// СТАНДАРТНАЯ ЛОГИКА ДЛЯ ОБЫЧНЫХ TOGGLES
					if (toggle.elementref.checked) {
						// АКТИВАЦИЯ
						if (toggle.reveal) {
							toggle.reveal.classList.remove("hidden");
						}

						// Обновляем счетчик
						if (toggle.counter) {
							updateCountersForToggle(toggle, target);
						}

						// ОБРАБОТКА RADIO ГРУПП
						if (toggle.radioid && toggle.radioid.length > 0) {
							toggle.radioid.forEach((id) => {
								const radioToggle = toggles.find(
									(t) => t.id === id
								);
								if (
									radioToggle &&
									radioToggle.elementref.checked
								) {
									// Деактивируем radio toggle
									radioToggle.elementref.checked = false;
									target.current_value -= radioToggle.price;
									if (radioToggle.reveal) {
										radioToggle.reveal.classList.add(
											"hidden"
										);
									}

									// Сбрасываем счетчики радио-элемента
									if (
										radioToggle.counter &&
										radioToggle.counter.total
									) {
										target.current_value -=
											radioToggle.counter.total;
										radioToggle.counter.total = 0;
									}

									// Сбрасываем nested toggles радио-элемента
									if (radioToggle.nested) {
										radioToggle.nested.forEach(
											(nestedId) => {
												const nestedToggle =
													toggles.find(
														(t) => t.id === nestedId
													);
												if (
													nestedToggle &&
													nestedToggle.elementref
														.checked
												) {
													nestedToggle.elementref.checked = false;
													target.current_value -=
														nestedToggle.price;
													if (nestedToggle.reveal) {
														nestedToggle.reveal.classList.add(
															"hidden"
														);
													}
												}
											}
										);
									}
								}
							});
						}

						// АКТИВАЦИЯ NESTED TOGGLES (БЕЗ ДОБАВЛЕНИЯ СТОИМОСТИ)
						if (toggle.nested && toggle.nested.length > 0) {
							toggle.nested.forEach((nestedToggleid) => {
								const nestedToggle = toggles.find(
									(t) => t.id === nestedToggleid
								);
								if (
									nestedToggle &&
									!nestedToggle.elementref.checked
								) {
									nestedToggle.elementref.checked = true;
									if (nestedToggle.reveal) {
										nestedToggle.reveal.classList.remove(
											"hidden"
										);
									}

									const section = document.querySelector(
										`#section-${
											nestedToggleid.split("-")?.[0]
										}`
									);
									if (section) section.checked = true;
								}
							});
						}

						// ДОБАВЛЯЕМ СТОИМОСТЬ ОСНОВНОГО TOGGLE
						target.current_value += toggle.price;

						// УПРАВЛЕНИЕ БЛОКАМИ - ПРИМЕНЯЕМ ТОЛЬКО ДЛЯ НЕ-ВНУТРЕННИХ TOGGLES
						if (!isTenderInnerToggle) {
							if (toggle.showAccordionItems) {
								showAccordionItems(toggle.showAccordionItems);
							}
							if (toggle.hideAccordionItems) {
								hideAccordionItems(toggle.hideAccordionItems);
							}
						}
					} else {
						// ДЕАКТИВАЦИЯ
						if (toggle.reveal) {
							toggle.reveal.classList.add("hidden");
						}

						// ВЫЧИТАЕМ СТОИМОСТЬ СЧЕТЧИКА
						if (toggle.counter?.total) {
							target.current_value -= toggle.counter.total;
							toggle.counter.total = 0;
						}

						// ДЕАКТИВАЦИЯ NESTED TOGGLES (БЕЗ ВЫЧИТАНИЯ СТОИМОСТИ)
						if (toggle.nested && toggle.nested.length > 0) {
							toggle.nested.forEach((nestedToggleid) => {
								const nestedToggle = toggles.find(
									(t) => t.id === nestedToggleid
								);
								if (
									nestedToggle &&
									nestedToggle.elementref.checked
								) {
									nestedToggle.elementref.checked = false;
									if (nestedToggle.reveal) {
										nestedToggle.reveal.classList.add(
											"hidden"
										);
									}
								}
							});
						}

						// ВЫЧИТАЕМ СТОИМОСТЬ ОСНОВНОГО TOGGLE
						target.current_value -= toggle.price;

						// УПРАВЛЕНИЕ БЛОКАМИ - ПРИМЕНЯЕМ ТОЛЬКО ДЛЯ НЕ-ВНУТРЕННИХ TOGGLES
						if (!isTenderInnerToggle) {
							if (toggle.showAccordionItems) {
								hideAccordionItems(toggle.showAccordionItems);
							}
							if (toggle.hideAccordionItems) {
								showAccordionItems(toggle.hideAccordionItems);
							}
						}
					}

					// Гарантируем, что стоимость не станет отрицательной
					if (target.current_value < 0) {
						target.current_value = 0;
					}
				});
			});

			// ОБРАБОТКА COUNTERS
			counters.forEach((counter) => {
				const changeEvent = new Event("input");
				counter.elementref.nextElementSibling?.addEventListener(
					"click",
					() => {
						counter.elementref.value++;
						counter.elementref.dispatchEvent(changeEvent);
					}
				);
				counter.elementref.previousElementSibling?.addEventListener(
					"click",
					() => {
						if (
							counter.elementref.dataset?.intendfor ===
							"design-landing"
						) {
							if (counter.elementref.value > 1) {
								counter.elementref.value--;
							}
						} else if (counter.elementref.value > 0) {
							counter.elementref.value--;
						}
						counter.elementref.dispatchEvent(changeEvent);
					}
				);
				counter.elementref.addEventListener("input", () => {
					// Находим связанный toggle
					const relatedToggle = toggles.find(
						(t) => t.id === counter.intendfor
					);

					if (relatedToggle && relatedToggle.elementref.checked) {
						// Если toggle активирован, обновляем стоимость
						const oldTotal = counter.total;
						counter.total =
							parseInt(
								counter.elementref.value === ""
									? "0"
									: counter.elementref.value
							) * counter.price;
						const difference = counter.total - oldTotal;
						target.current_value += difference;
					} else {
						// Если toggle не активирован, просто обновляем total
						counter.total =
							parseInt(
								counter.elementref.value === ""
									? "0"
									: counter.elementref.value
							) * counter.price;
					}

					// Гарантируем, что стоимость не станет отрицательной
					if (target.current_value < 0) {
						target.current_value = 0;
					}
				});
				counter.elementref.addEventListener("keydown", (e) => {
					const blockedkeys = ["-", ",", ".", "+"];
					if (blockedkeys.includes(e.key)) {
						e.preventDefault();
					}
				});
				counter.elementref.addEventListener("blur", () => {
					if (counter.elementref.value === "") {
						counter.elementref.value = 0;
					}
					if (
						counter.elementref.dataset?.intendfor ===
							"design-landing" &&
						counter.elementref.value < 1
					) {
						counter.elementref.value = 1;
					}
				});
			});

			sentButton?.addEventListener("click", () => {
				const review = {
					options: toggles.filter(
						(toggle) => toggle.elementref.checked
					),
					extra: texts.filter((text) => text.elementref.value !== ""),
					preprice: target.innerText,
				};
				console.log(review);
			});

			reset_button?.addEventListener("click", () => {
				resetCalculator(toggles, target);
			});

			if (hash) {
				handleToggleByHash(hash, toggles);
			}
		}
	}
});

// new
// calculator v1 с жесткими пресетами для типов сайтов
document.addEventListener("DOMContentLoaded", () => {
	if (document.querySelector("#calculator")) {
		const inputs = document
			.getElementById("calculator")
			?.querySelectorAll(".accordion-content input");
		const reset_button = document.getElementById("reset-options-btn");
		const sentButton = document.getElementById("send-calculator-total");
		const target = document.getElementById("calculator-total-target");
		const hash = window.location.hash;
		const togglechange = new Event("change");

		const formatNumber = (num) => {
			const [integer, decimal] = num.toString().split(".");
			const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
			return formatted;
		};

		Object.defineProperty(target, "current_value", {
			get() {
				return this._current_value;
			},
			set(val) {
				this._current_value = val;
				this.innerText = formatNumber(val);
			},
			configurable: true,
		});

		// ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ БЛОКАМИ
		const showElement = (element) => {
			if (element) element.classList.remove("hidden");
		};

		const hideElement = (element) => {
			if (element) element.classList.add("hidden");
		};

		const showAccordionItems = (accordionItemIds) => {
			if (!accordionItemIds) return;
			accordionItemIds.forEach((itemId) => {
				const item = document.getElementById(itemId);
				showElement(item);
			});
		};

		const hideAccordionItems = (accordionItemIds) => {
			if (!accordionItemIds) return;
			accordionItemIds.forEach((itemId) => {
				const item = document.getElementById(itemId);
				hideElement(item);
			});
		};

		// ФУНКЦИЯ ДЛЯ ПОЛНОГО СБРОСА КАЛЬКУЛЯТОРА
		const resetCalculator = (toggles, target) => {
			toggles.forEach((toggle) => {
				toggle.elementref.checked = false;
				if (toggle.reveal) {
					toggle.reveal.classList.add("hidden");
				}
				if (toggle.counter) {
					toggle.counter.total = 0;
					toggle.counter.elementref.value = 0;
				}

				if (toggle.elementref.dataset?.intendfor === "design-landing") {
					console.log(toggle.counter);
					if (toggle.elementref.value < 1) {
						toggle.elementref.value = 1;
					}
				}
			});
			target.current_value = 0;

			// Показываем все accordion-items при сбросе
			const allAccordionItems =
				document.querySelectorAll(".accordion-item");
			allAccordionItems.forEach((item) => {
				item.classList.remove("hidden");
			});
		};

		// ФУНКЦИЯ ДЛЯ ПРИМЕНЕНИЯ ПРЕСЕТА ТИПА САЙТА
		const applySiteTypePreset = (selectedToggle, toggles, target) => {
			// Полностью сбрасываем калькулятор
			resetCalculator(toggles, target);

			// Применяем выбранный тип сайта
			selectedToggle.elementref.checked = true;
			target.current_value += selectedToggle.price;

			// Показываем reveal блок
			if (selectedToggle.reveal) {
				selectedToggle.reveal.classList.remove("hidden");
			}

			// Активируем все nested toggles и добавляем их стоимость
			if (selectedToggle.nested && selectedToggle.nested.length > 0) {
				selectedToggle.nested.forEach((nestedToggleId) => {
					const nestedToggle = toggles.find(
						(t) => t.id === nestedToggleId
					);
					if (nestedToggle) {
						nestedToggle.elementref.checked = true;
						target.current_value += nestedToggle.price;

						// Добавляем стоимость счетчиков nested toggles
						if (nestedToggle.counter) {
							const counter = nestedToggle.counter;
							// ВОССТАНАВЛИВАЕМ ЗНАЧЕНИЕ СЧЕТЧИКА ИЗ HTML
							const defaultValue = parseInt(
								counter.elementref.getAttribute("value") || "0"
							);
							counter.elementref.value = defaultValue;
							counter.total = defaultValue * counter.price;
							target.current_value += counter.total;

							// ПОКАЗЫВАЕМ REVEAL-БЛОК ДЛЯ СЧЕТЧИКА
							if (nestedToggle.reveal) {
								nestedToggle.reveal.classList.remove("hidden");
							}
						}

						// ПОКАЗЫВАЕМ REVEAL-БЛОК ДЛЯ NESTED TOGGLE
						if (nestedToggle.reveal) {
							nestedToggle.reveal.classList.remove("hidden");
						}

						// Активируем связанные секции
						const section = document.querySelector(
							`#section-${nestedToggleId.split("-")?.[0]}`
						);
						if (section) {
							section.checked = true;
						}
					}
				});
			}

			// Управляем блоками accordion
			if (selectedToggle.showAccordionItems) {
				showAccordionItems(selectedToggle.showAccordionItems);
			}
			if (selectedToggle.hideAccordionItems) {
				hideAccordionItems(selectedToggle.hideAccordionItems);
			}
		};

		// ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ СЧЕТЧИКОВ
		const updateCountersForToggle = (toggle, target) => {
			if (toggle.counter) {
				const counter = toggle.counter;
				const currentValue = parseInt(counter.elementref.value || "0");
				counter.total = currentValue * counter.price;

				if (toggle.elementref.checked) {
					target.current_value += counter.total;
				}
			}
		};

		// ФУНКЦИЯ ДЛЯ ПРОВЕРКИ, ЯВЛЯЕТСЯ ЛИ TOGGLE ВНУТРЕННИМ ДЛЯ ТЕНДЕРНОГО ПОРТАЛА
		const isTenderPortalInnerToggle = (toggle) => {
			const tenderConfigIds = [
				"tender-portal_config",
				"tender-portal_paying_config",
			];

			for (const configId of tenderConfigIds) {
				const configElement = document.getElementById(configId);
				if (
					configElement &&
					configElement.contains(toggle.elementref)
				) {
					return true;
				}
			}
			return false;
		};

		const handleToggleByHash = (hash, toggles) => {
			const id = hash.replace("#", "");
			const handle_target = toggles.find((t) => t.id === id);
			if (handle_target) {
				try {
					handle_target.elementref.checked = true;
					handle_target.elementref.dispatchEvent(togglechange);
					if (
						handle_target.nested &&
						handle_target.nested.length > 0
					) {
						handle_target.nested.forEach((nestedToggleid) => {
							const nestedToggle = toggles.find(
								(t) => t.id === nestedToggleid
							);
							const section = document.querySelector(
								`#section-${nestedToggleid.split("-")?.[0]}`
							);
							if (section) section.checked = true;
							try {
								if (nestedToggle) {
									nestedToggle.elementref.checked = true;
									nestedToggle.elementref.dispatchEvent(
										togglechange
									);
								} else {
									console.error(
										"=> ",
										nestedToggleid,
										"not found"
									);
								}
								if (nestedToggle?.reveal) {
									nestedToggle.reveal.classList.remove(
										"hidden"
									);
								}
							} catch (err) {
								console.error(nestedToggleid, err);
							}
						});
					}
					console.log("=> sucess");
				} catch (err) {
					console.log("=> error", err);
				}
			}
		};

		// ОБНОВЛЕН toggleConverter - УТОЧНЕННАЯ ЛОГИКА ДЛЯ isSiteType
		const toggleConverter = (inputs) => {
			const toggles = [];
			const counters = [];
			const texts = [];

			// Определяем основные типы сайтов
			const mainSiteTypes = [
				"type-landing",
				"type-portfolio",
				"type-corporate",
				"type-corporate_catalogue",
				"type-store",
				"type-store_ai",
				"type-portal",
				"tender-portal",
				"tender-portal-paying",
				"type-unique",
			];

			inputs.forEach((input) => {
				switch (input.type) {
					case "checkbox": {
						// Проверяем, является ли это основным типом сайта
						const isMainSiteType = mainSiteTypes.includes(input.id);

						toggles.push({
							id: input.id,
							elementref: input,
							price: parseInt(input.dataset.price || "0"),
							nested: input.dataset.nested?.split(";"),
							reveal: document.getElementById(
								input.dataset.reveal || ""
							),
							radioid: input.dataset.radio?.split(";"),
							showAccordionItems:
								input.dataset.showAccordionItem?.split(";"),
							hideAccordionItems:
								input.dataset.hideAccordionItem?.split(";"),
							isSiteType: isMainSiteType,
						});
						break;
					}
					case "number": {
						counters.push({
							id: input.id,
							elementref: input,
							price: parseInt(input.dataset.price || "0"),
							total:
								parseInt(input.dataset.price || "0") *
								(parseInt(input.value) || 0),
							intendfor: input.dataset.intendfor,
						});
						break;
					}
					default: {
						texts.push({
							id: input.id,
							elementref: input,
						});
						break;
					}
				}
			});

			toggles.forEach((toggle) => {
				counters.forEach((counter) => {
					if (counter.intendfor === toggle.id) {
						toggle.counter = counter;
					}
				});
			});

			return { toggles: toggles, counters: counters, texts: texts };
		};

		if (inputs && target) {
			const { toggles, counters, texts } = toggleConverter(inputs);
			target.innerText = 0;
			target.current_value = 0;

			toggles.forEach((toggle) => {
				toggle.elementref.addEventListener("change", () => {
					// ОСОБАЯ ЛОГИКА ДЛЯ ТИПОВ САЙТОВ
					if (toggle.isSiteType) {
						if (toggle.elementref.checked) {
							applySiteTypePreset(toggle, toggles, target);
						} else {
							resetCalculator(toggles, target);
						}
						// При отключении типа сайта ничего не делаем - это обрабатывается при включении нового типа
						return;
					}

					// ПРОВЕРЯЕМ, ЯВЛЯЕТСЯ ЛИ TOGGLE ВНУТРЕННИМ ДЛЯ ТЕНДЕРНОГО ПОРТАЛА
					const isTenderInnerToggle =
						isTenderPortalInnerToggle(toggle);

					// СТАНДАРТНАЯ ЛОГИКА ДЛЯ ОБЫЧНЫХ TOGGLES
					if (toggle.elementref.checked) {
						// АКТИВАЦИЯ
						if (toggle.reveal) {
							toggle.reveal.classList.remove("hidden");
						}

						// Обновляем счетчик
						if (toggle.counter) {
							updateCountersForToggle(toggle, target);
						}

						// ОБРАБОТКА RADIO ГРУПП
						if (toggle.radioid && toggle.radioid.length > 0) {
							toggle.radioid.forEach((id) => {
								const radioToggle = toggles.find(
									(t) => t.id === id
								);
								if (
									radioToggle &&
									radioToggle.elementref.checked
								) {
									// Деактивируем radio toggle
									radioToggle.elementref.checked = false;
									target.current_value -= radioToggle.price;
									if (radioToggle.reveal) {
										radioToggle.reveal.classList.add(
											"hidden"
										);
									}

									// Сбрасываем счетчики радио-элемента
									if (
										radioToggle.counter &&
										radioToggle.counter.total
									) {
										target.current_value -=
											radioToggle.counter.total;
										radioToggle.counter.total = 0;
									}

									// Сбрасываем nested toggles радио-элемента
									if (radioToggle.nested) {
										radioToggle.nested.forEach(
											(nestedId) => {
												const nestedToggle =
													toggles.find(
														(t) => t.id === nestedId
													);
												if (
													nestedToggle &&
													nestedToggle.elementref
														.checked
												) {
													nestedToggle.elementref.checked = false;
													target.current_value -=
														nestedToggle.price;
													if (nestedToggle.reveal) {
														nestedToggle.reveal.classList.add(
															"hidden"
														);
													}
												}
											}
										);
									}
								}
							});
						}

						// АКТИВАЦИЯ NESTED TOGGLES (БЕЗ ДОБАВЛЕНИЯ СТОИМОСТИ)
						if (toggle.nested && toggle.nested.length > 0) {
							toggle.nested.forEach((nestedToggleid) => {
								const nestedToggle = toggles.find(
									(t) => t.id === nestedToggleid
								);
								if (
									nestedToggle &&
									!nestedToggle.elementref.checked
								) {
									nestedToggle.elementref.checked = true;
									if (nestedToggle.reveal) {
										nestedToggle.reveal.classList.remove(
											"hidden"
										);
									}

									const section = document.querySelector(
										`#section-${
											nestedToggleid.split("-")?.[0]
										}`
									);
									if (section) section.checked = true;
								}
							});
						}

						// ДОБАВЛЯЕМ СТОИМОСТЬ ОСНОВНОГО TOGGLE
						target.current_value += toggle.price;

						// УПРАВЛЕНИЕ БЛОКАМИ - ПРИМЕНЯЕМ ТОЛЬКО ДЛЯ НЕ-ВНУТРЕННИХ TOGGLES
						if (!isTenderInnerToggle) {
							if (toggle.showAccordionItems) {
								showAccordionItems(toggle.showAccordionItems);
							}
							if (toggle.hideAccordionItems) {
								hideAccordionItems(toggle.hideAccordionItems);
							}
						}
					} else {
						// ДЕАКТИВАЦИЯ
						if (toggle.reveal) {
							toggle.reveal.classList.add("hidden");
						}

						// ВЫЧИТАЕМ СТОИМОСТЬ СЧЕТЧИКА
						if (toggle.counter?.total) {
							target.current_value -= toggle.counter.total;
							toggle.counter.total = 0;
						}

						// ДЕАКТИВАЦИЯ NESTED TOGGLES (БЕЗ ВЫЧИТАНИЯ СТОИМОСТИ)
						if (toggle.nested && toggle.nested.length > 0) {
							toggle.nested.forEach((nestedToggleid) => {
								const nestedToggle = toggles.find(
									(t) => t.id === nestedToggleid
								);
								if (
									nestedToggle &&
									nestedToggle.elementref.checked
								) {
									nestedToggle.elementref.checked = false;
									if (nestedToggle.reveal) {
										nestedToggle.reveal.classList.add(
											"hidden"
										);
									}
								}
							});
						}

						// ВЫЧИТАЕМ СТОИМОСТЬ ОСНОВНОГО TOGGLE
						target.current_value -= toggle.price;

						// УПРАВЛЕНИЕ БЛОКАМИ - ПРИМЕНЯЕМ ТОЛЬКО ДЛЯ НЕ-ВНУТРЕННИХ TOGGLES
						if (!isTenderInnerToggle) {
							if (toggle.showAccordionItems) {
								hideAccordionItems(toggle.showAccordionItems);
							}
							if (toggle.hideAccordionItems) {
								showAccordionItems(toggle.hideAccordionItems);
							}
						}
					}

					// Гарантируем, что стоимость не станет отрицательной
					if (target.current_value < 0) {
						target.current_value = 0;
					}
				});
			});

			// ОБРАБОТКА COUNTERS
			counters.forEach((counter) => {
				const changeEvent = new Event("input");
				counter.elementref.nextElementSibling?.addEventListener(
					"click",
					() => {
						counter.elementref.value++;
						counter.elementref.dispatchEvent(changeEvent);
					}
				);
				counter.elementref.previousElementSibling?.addEventListener(
					"click",
					() => {
						if (
							counter.elementref.dataset?.intendfor ===
							"design-landing"
						) {
							if (counter.elementref.value > 1) {
								counter.elementref.value--;
							}
						} else if (counter.elementref.value > 0) {
							counter.elementref.value--;
						}
						counter.elementref.dispatchEvent(changeEvent);
					}
				);
				counter.elementref.addEventListener("input", () => {
					// Находим связанный toggle
					const relatedToggle = toggles.find(
						(t) => t.id === counter.intendfor
					);

					if (relatedToggle && relatedToggle.elementref.checked) {
						// Если toggle активирован, обновляем стоимость
						const oldTotal = counter.total;
						counter.total =
							parseInt(
								counter.elementref.value === ""
									? "0"
									: counter.elementref.value
							) * counter.price;
						const difference = counter.total - oldTotal;
						target.current_value += difference;
					} else {
						// Если toggle не активирован, просто обновляем total
						counter.total =
							parseInt(
								counter.elementref.value === ""
									? "0"
									: counter.elementref.value
							) * counter.price;
					}

					// Гарантируем, что стоимость не станет отрицательной
					if (target.current_value < 0) {
						target.current_value = 0;
					}

					if (
						counter.elementref.dataset?.intendfor ===
						"design-landing"
					) {
						if (counter.elementref.value < 1) {
							counter.elementref.value = 1;
						}
					}

					counter.elementref.dispatchEvent(changeEvent);
				});
				counter.elementref.addEventListener("keydown", (e) => {
					const blockedkeys = ["-", ",", ".", "+"];
					if (blockedkeys.includes(e.key)) {
						e.preventDefault();
					}
				});
				counter.elementref.addEventListener("blur", () => {
					if (counter.elementref.value === "") {
						counter.elementref.value = 0;
					}
					// if (
					// 	counter.elementref.dataset?.intendfor ===
					// 		"design-landing" &&
					// 	counter.elementref.value < 1
					// ) {
					// 	counter.elementref.value = 1;
					// }

					if (
						counter.elementref.dataset?.intendfor ===
						"design-landing"
					) {
						if (counter.elementref.value < 1) {
							counter.elementref.value = 1;
						}
					}
				});
			});

			sentButton?.addEventListener("click", () => {
				const review = {
					options: toggles.filter(
						(toggle) => toggle.elementref.checked
					),
					extra: texts.filter((text) => text.elementref.value !== ""),
					preprice: target.innerText,
				};
				console.log(review);
			});

			reset_button?.addEventListener("click", () => {
				resetCalculator(toggles, target);
			});

			if (hash) {
				handleToggleByHash(hash, toggles);
			}
		}
	}
});
