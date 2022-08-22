import React from 'react';
import './static-pages-css.css'
import {Header, Loader, Breadcrumb, Icon, Label} from 'semantic-ui-react'

export default class PrivacyPolicy extends React.Component {

    constructor(props) {
        super(props);

    }

    clicked = () => {
        window.location = window.location.origin
    };

    render() {
        return (
            <div className={'static-container'}>
                <Breadcrumb>
                    <Breadcrumb.Section link onClick={() => this.clicked()}>Top</Breadcrumb.Section>
                    <Breadcrumb.Divider icon='right chevron'/>
                    <Breadcrumb.Section active>{`プライバシーポリシー`}</Breadcrumb.Section>
                </Breadcrumb>

                <div className={'description-section'}>
                    <h1>プライバシーポリシー</h1>
                    <div className={'details-section'}>
                        <span>SPM 株式会社（以下「弊社」といいます。）は、 本ウェブサイトであるnichijoメディア （以下「本サイト」といいます。）の、 事業活動を遂行するに当たって、弊社が保有するお客様の個人情報の保護を、当社が果たすべき重要な社会的責任の一つと認識し、このような社会的責任を果たすべく、以下の通り個人情報保護方針を定め、これを遵守いたします。</span>

                        <p>個人情報の利用目的</p>
                        <span>弊社は、個人情報の取得に際しては、取得目的を正当な事業の範囲内で明確に定め、その目的達成に必要な限度において、あらかじめお客様のご了解のもと、適法かつ公正な方法で取得し、利用します。 また、あらかじめお客様からご了解をいただいている場合、法令等に特別の定めがある場合、およびその他正当な理由がある場合を除き、お客様の個人情報を第三者（外国にある第三者を含む）に提供しません。</span>

                        <p>個人情報の取得</p>
                        <span>弊社は、適法かつ公正な手段によって、利用目的を明示した上で、必要な範囲の個人情報を取得します。弊社は、お客様が容易に認識できない方法によって個人情報を取得することはありません。</span>

                        <p>個人情報の利用</p>
                        <span>弊社は、個人情報を、取得の際に示した利用目的の範囲内で、業務の遂行上必要な限りにおいて利用します。 弊社は、個人情報を第三者との間で共同利用し、又は、個人情報の取り扱いを第三者に委託する場合には、当該第三者につき厳正な調査を行った上、秘密を保持させるために、適正な監督を行います。</span>

                        <p>個人情報の第三者提供</p>
                        <span>弊社は、法令に定める場合を除き、個人情報を予め本人の同意を得ることなく、第三者に提供致しません。</span>

                        <p>アクセスログ収集とその利用について</p>
                        <span>本サイトは、アクセスログの収集・解析には GoogleAnalyticsを利用しております。 このため、一部のページにおいて GoogleAnalyticsから提供されるクッキー(cookie)を使用し、個人を特定する情報を含まずにログを収集します。 クッキーの使用に関する説明、クッキーによって収集される情報について詳しくお知りになりたい方は、 GoogleAnalyticsのプライバシーポリシーをご確認ください。</span>

                        <p>個人情報の安全管理措置</p>
                        <span>弊社は、個人情報の正確性を保ち、これを安全に管理いたします。 弊社は、個人情報の紛失、破壊及び漏えい等を防止するため、不正アクセス、コンピュータウイルス等に対する適正な情報セキュリティ対策を講じると共に、弊社内において個人情報保護に関する社内規定を整備し、これらを適切に運用する等必要かつ適切な措置を講じます。</span>

                        <p>個人情報の開示・訂正等への対応</p>
                        <span>弊社が保有する個人情報の開示、訂正、利用停止等に関するお申し出、弊社の個人情報の取り扱いに関するお問い合わせ、苦情等は弊社までご連絡ください。</span>

                        <p>継続的改善</p>
                        <span>弊社は、個人情報を取り巻く社会情勢・業界動向、お客様のご要望及び最新のネットワーク技術動向等に留意し、個人情報保護方針、個人情報取扱規定及びこれらの運用について適時、適切な見直しを図り、その改善を継続的に行ってまいります。そのため、本方針は、予告なく改定されることがあります。変更があった場合は、当社のWebサイト上で掲示を行いお客様へお知らせいたします。</span>
                    </div>

                    <div className={'contact-section'}>
                        <h1>お問い合わせ先</h1>
                        <p>SPM（エス・ピー・エム）株式会社</p>
                        <p>105-0013
                            <p>東京都港区浜松町2-2-15 浜松町ダイヤビル2F</p></p>
                        <a>お問い合わせフォーム</a>
                    </div>
                </div>
            </div>
        );
    }


}