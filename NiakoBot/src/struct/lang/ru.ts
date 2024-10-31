export default {
    system: {
        useWhileDebugging: 'Бот разрабатывается. В это время Вы не можете использовать команды бота!',
        unknownSlashCommand: 'Ой... Я не знаю откуда эта команда',
        unknownInteraction: 'Ой... Я не знаю, что это за интеграция',
        cooldownBeforeCommand: '{cooldown} Вы сможете использовать команду',
        qiwiNotAvailable: 'Сервис QIWI в данный момент не доступен',

        unknownGuild: 'Неизвестный сервер',
        unknownBoost: 'Неизвестная звезда',
        error: 'Ошибка',
        yes: 'Да',
        no: 'Нет',
        page: 'Страница',
        loading: 'Загрузка...',
        serverId: 'ID сервера'
    },

    errors: {
        unknownGuildId: 'Меня нет на сервере с ID "{id}"',
        numberIsNaN: 'Указанное число им не являтся',
        zeroIsGreaterThanNumber: 'Укажите натуральное число, которое больше 0',
        depositIsGreaterThanCount: 'Минимальный счет поплнения {meta.minDepositAmount}',
        dontHaveEnoughRuble: 'У Вас **недостаточно** {emojis.premium.ruble}',
        saveError: 'Ошибка сохранения документа, попробуйте снова...\n> *Обратитесь в поддержку, если проблема не решится*',
        
        boost: {
            noFree: 'У Вас **нет** свободных {emojis.premium.boost}',
            noFreeWithGuild: 'У Вас **нет** свободных {emojis.premium.boost} с сервера **{name}**'
        },

        qiwi: {
            billIdNotEqualToNo: 'У Вас уже есть активный запрос на пополнение {emojis.premium.operation.qiwi}',
            thisIsNotYourAccount: 'Вы **не можете** отменить **чужой** счёт {emojis.premium.operation.qiwi}',
            notHaveAnActiveRequest: 'У Вас **нет** активного запроса {emojis.premium.operation.qiwi}',
            accountAlreadyPaid: 'Ваш счёт **уже** оплачен\n> **・**Вы можете только **принять** оплату',
            maximumNumberOfRequests: {
                title: 'Пополнение баланса',
                description: 'Вы слишком **много** раз оплачивали **заказ** через {emojis.premium.operation.qiwi}\n\n**・** *Вы можете **создать** новую **ссылку** на оплату {emojis.premium.ruble}*'
            },
            status: {
                waiting: 'Счёт до сих пор **не** оплачен',
                rejected: 'Счёт был **отклонен**',
                expired: 'Ссылка на **оплату** счета была **истечена**',
                paid: 'Счёт **оплачен**'
            }
        }
    },

    buttons: {
        shop: 'Магазин',
        manage: 'Управление',
        info: 'Информация',
        leave: 'Назад',
        leaveBack: 'Вернуться назад',
        buyStar: 'Купить звёзды',
        topUpBalance: 'Пополнить баланс',
        transactions: 'Транзакции',
        goToThePayment: 'Перейти к оплате',
        checkPaid: 'Я оплатил',
        cancelPaid: 'Я передумал',
        giveBoost: 'Дать звезду',
        removeBoost: 'Убрать звезду',
        extendBoost: 'Продлить звезду на месяц за {util.resolveBoostCost(1)}',
        accessBuyStar: `Купить {count} за {cost}`
    },

    modals: {
        replenishment: {
            title: 'Пополнение баланса',
            count: 'Количество',
            placeholder: 'На сколько хотите пополнить?'
        },
        boostCount: {
            title: 'Покупка звёзд',
            count: 'Количество',
            placeholder: '2'
        },
        giveBoost: 'Выдать звезду',
        removeBoost: 'Забрать звезду'
    },

    menus: {
        operation: {
            placeholder: 'Выберите необходимый сервис',
            qiwi: 'Оплата qiwi-кошелька + RU карты'
        },
        chooseInfoBoosts: {
            placeholders: {
                have: 'Информация о звезде',
                not: 'У Вас нет звёзд'
            },
            options: {
                haveServer: {
                    description: 'Выдан буст серверу {boostBoostedTime}'
                },
                noActived: {
                    label: 'Не активирован',
                    description: 'Период ещё не начался'
                },
                noBoosted: {
                    label: 'Не использован',
                    description: 'Время использование тратится в пустую'
                }
            }
        }
    },

    commands: {
        ping: 'Информация задержке 🏓\n\nЗадержка Discord API: **{ping}**ms\nОтвет на сообщение: **{interactionEdited}**ms\nОбщая задержка: **{totalPing}**ms',
        premium: {
            menu: {
                description: (
                    `{author.mention}, Приветствую тебя в премиальной панели!` + '\n\n'
                    + `> **・** *Магазин* — покупка звёзд Niako` + '\n'
                    + `> **・** *Управление* — управление купленными {emojis.premium.boost}` + '\n'
                    + `> **・** *Информация* — информация о системе бустинга`
                )
            },
            shop: {
                title: 'Магазин Niako',
                description: (
                    `Здесь Ты можешь **приобрести** {emojis.premium.boost} Niako` + '\n\n'
                    + `**Текущий баланс:** {account.balance} {emojis.premium.ruble}`
                ),
                footer: '・Купить звёзды ты можешь после пополнения баланса'
            },
            operation: {
                title: 'Пополнение баланса',
                description: (
                    `Выберите **через** какой **сервис** Вам удобнее **пополнить** счёт на **{count}** {emojis.premium.ruble}`
                )
            },
            createPayment: {
                qiwi: {
                    description: 'Вы **создали** ссылку на **платеж** через сервис {emojis.premium.operation.qiwi}'
                },
                footer: '・После успешной оплаты нажми на соответствующую кнопку'
            },
            cancelQiwiPaid: {
                description: 'Вы **отменили** платеж через сервис {emojis.premium.operation.qiwi}',
                footer: '・Надеюсь Вы ещё пополните баланс'
            },
            checkQiwiPaid: {
                description: '**оплата** через сервис {emojis.premium.operation.qiwi} **успешно** пройдена.\n\n> **・**На Ваш **счёт** было добавлено **{count}** {emojis.premium.ruble}',
            },
            manage: {
                title: 'Управление звёздами',
                description: '{author.mention}, В этой панели Вы можете управлять своими {emojis.premium.boost}',
                footer: 'Не активированных: {boosts.noactived}・Не использованных: {boosts.noboosted}'
            },
            boostInfo: {
                title: 'Информация о звезде',
                parameters: {
                    inServer: 'Находится на сервере',
                    actived: 'Активирован',
                    boosted: 'Выдан',
                    bought: 'Куплен',
                    end: 'Закончится',
                },
                footer: '・Ваш текущий баланс: {account.balance}'
            },
            prolongBoost: {
                title: 'Продление звезды',
                description: 'Вы продлили звезду {emojis.premium.boost} на месяц'
            },
            transaction: {
                title: 'Транзакции',
                none: 'У Вас ещё **нет** пополнений...',
                state: {
                    buy: 'Покупка {count} звёзд',
                    replenishment: 'Пополнение на {count} рублей',
                    prolong: 'Продление звезды на месяц',
                    devAddBalance: 'Выдача от разработчика <@{userId}>',
                    devRemoveBalance: 'Удаление от разработчика <@{userId}>'
                }
            },
            bought: {
                title: 'Покупка звёзд',
                footer: '・Пополниь баланс Вы можете через прошлое меню',
                state: {
                    true: 'Вы **точно** хотите приоберсти **{count}** {emojis.premium.boost} за **{cost}** {emojis.premium.ruble}?',
                    false: 'У Вас **недостаточно** средств на балансе'
                }
            },
            accessBought: {
                description: 'Вы приобрели **{count}** {emojis.premium.boost} за **{cost}** {emojis.premium.ruble}',
                footer: '・Надеемся увидеть Вас снова'
            },
            removeOrGiveBoost: {
                title: 'Управление звёздами',
                give: 'С какого **сервера** Вы хотите **забрать** {emojis.premium.boost}?',
                remove: 'На какой **сервер** Вы хотите **выдать** {emojis.premium.boost}?'
            },
            accessGive: {
                title: 'Выдача звезды',
                description: 'Вы выдали {emojis.premium.boost} на сервер **{name}**'
            },
            accessRemove: {
                title: 'Забирание звезды',
                description: 'Вы забрали {emojis.premium.boost} с сервера **{name}**',
                notBoostedBoost: 'Буст не активирован на сервер'
            }
        }
    }
}