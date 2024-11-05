import { Component } from "react";
import Poster from '../../assets/imgs/GlobalImage.webp';
import { InfoPlugin } from '../../components/index';
import { withTranslation } from "react-i18next";
import { CaretRight, Shield } from '@gravity-ui/icons';
import styles from './HomeInfo.module.scss'

class HomeInfo extends Component {
    render() {
        return (
            <section id='sectionHomeInfo' className={styles.section}>
                {
                    this.state.plugins.map(
                        (plugin, i) => <InfoPlugin key={plugin.title} plugin={plugin} toRight={(i+1) % 2 === 0} />
                    )
                }
            </section>
        )
    }

    state = {
        plugins: [
            {
                icon: Shield,
                title: 'Антикраш',
                description: 'Этот интеллектуальный механизм разработан для обеспечения стабильности и безопасности вашего сервера',
                poster: Poster,
                data: [
                    {
                        icon: CaretRight,
                        title: 'Защита',
                        description: 'Мы позаботились о вашей безопасности. Модуль "Антикраш" активно мониторит и фильтрует потенциально опасные действия, обеспечивая стабильность работы сервера'
                    },
                    {
                        icon: CaretRight,
                        title: 'Белый список',
                        description: 'Возможность настраивать группы, которые могут взаимодействовать с ботом без каких-либо ограничений'
                    },
                    {
                        icon: CaretRight,
                        title: 'Установка роль бана',
                        description: 'Мгновенное принятие мер в случае выявления недобросовестных действий. Назначайте специальные роли для изоляции проблемных пользователей'
                    },
                    {
                        icon: CaretRight,
                        title: 'Настройка наказаний для каждого события',
                        description: 'Персонализированный подход к управлению мерами воздействия на нарушения. Задайте свои правила и наказания для каждого конкретного сценария'
                    }
                ]
            },
            {
                icon: Shield,
                title: 'Антирейд',
                description: 'Этот умный механизм разработан с учетом вашей безопасности и предназначен для предотвращения нежелательных вторжений в ваше сообщество',
                poster: Poster,
                data: [
                    {
                        title: 'Быстрое реагирование',
                        description: 'Модуль "Антирейд" обеспечивает мгновенное реагирование на потенциально вредоносные действия, минимизируя риск и удерживая ваше сообщество в безопасности',
                        icon: CaretRight
                    },
                    {
                        title: 'Уведомления и логирование',
                        description: 'Подробные уведомления и логи позволяют вам быть в курсе событий и оперативно реагировать на любые изменения в статусе вашего сообщества',
                        icon: CaretRight
                    },
                    {
                        title: 'Наказания',
                        description: 'Гибкие настройки для применения санкций к нарушителям. Вы определяете правила и типы наказаний, а модуль "Антирейд" надежно их осуществляет',
                        icon: CaretRight
                    }
                ],
            },
            {
                icon: Shield,
                title: 'Модерация',
                description: 'Этот инструмент предоставляет вам мощные функции модерации с интуитивно понятным интерфейсом',
                poster: Poster,
                data: [
                    {
                        title: 'Система модерации',
                        description: 'Отточенная система, которая помогает вам легко контролировать активности в сообществе. Простота использования делает модерацию приятным и быстрым процессом',
                        icon: CaretRight
                    },
                    {
                        title: 'Удобство использования',
                        description: 'Каждая команда предоставляет удобные опции для быстрого и точного управления. Все инструменты находятся под рукой, что делает модерацию максимально эффективной',
                        icon: CaretRight
                    },
                    {
                        title: 'Кастомизация команд',
                        description: 'Вы можете настроить команды в соответствии с требованиями вашего сообщества, устанавливая их под различные роли. Гибкие настройки помогут вам адаптировать модерацию под свои потребности',
                        icon: CaretRight
                    },
                    {
                        title: 'Наказания',
                        description: 'Возможность просмотра списка наказаний и легкая настройка санкций для нарушителей. Всё, что вам нужно для поддержания порядка в сообществе',
                        icon: CaretRight
                    },
                ]
            }
        ]
    }
}

export default withTranslation()(HomeInfo)