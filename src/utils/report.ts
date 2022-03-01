import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { GetStaticUrl } from './static';

export type Report = {
    id?: string;
    theme: number;
    mode: string;
    brief: {
        duration: number;
        endAt: number;
        squad: string;
        ending: string;
    };
    recruits: Array<Recruit>;
    collections: Array<string>;
    initial: {
        recruitGroup: string;
        recruits: Array<string>;
        support: string;
    };
    zones: Array<Zone>;
};
type Recruit = {
    name: string;
    upgraded: boolean;
};
type Zone = {
    enterZone: string;
    variations: Array<string>;
    nodeList: Array<Node>;
};
type Node = {
    type: number;
    stage: string;
    select: Array<string>;
    collections: Array<string>;
    capsules: Array<string>;
    tools: Array<string>;
    tickets: Array<string>;
    recruits: Array<string>;
    upgrades: Array<string>;
    shop: {
        buys: Array<BuyItem>;
        invest: number;
    };
};
type BuyItem = {
    collection: string;
    cost: number;
};
type CharData = {
    [key: string]: {
        name: string;
        profession: string;
        subProfessionId: string;
        rarity: number;
    };
};
type RelicData = {
    [key: string]: {
        id: string;
        name: string;
        description: string;
        usage: string;
        rarity: string;
        value: number;
        unlock: null | string;
    };
};
type BandData = {
    [key: string]: {
        name: string;
        upgrade: Array<string>;
        usage: string;
        unlock: string;
    };
};
const enum PROFESSION {
    SNIPER = 'SNIPER',
    TANK = 'TANK',
    CASTER = 'CASTER',
    PIONEER = 'PIONEER',
    MEDIC = 'MEDIC',
    WARRIOR = 'WARRIOR',
    SPECIAL = 'SPRCIAL',
    SUPPORT = 'SUPPORT'
}

const charDataUrl = GetStaticUrl('/gamedata/character.json');
const relicDataUrl = GetStaticUrl('/gamedata/relic.json');
const BandDataUrl = GetStaticUrl('/gamedata/band.json');

let charData: CharData = {};
axios.get(charDataUrl).then(res => {
    charData = res.data;
});

let relicData: RelicData = {};
axios.get(relicDataUrl).then(res => {
    relicData = res.data;
});

let bandMap = new Map<string, string[]>();
axios.get(BandDataUrl).then(res => {
    const bands: BandData = res.data;
    for (let band of Object.values(bands)) {
        bandMap.set(band['name'], band['upgrade']);
    }
});

const GetCharacterPro = function (name: string): string {
    return Object.values(charData).find(i => i.name == name)?.profession ?? '';
};
const GetCharacterRare = function (name: string): number {
    return Object.values(charData).find(i => i.name == name)?.rarity ?? 0;
};
//TODO:在考虑是否将关卡名转换成关卡的对应代码
const Stageid = function (data: string): string {
    return data;
};
const GetTextFromXML = function (text: string, index = 0): string {
    const parser = new XMLParser();
    const xmlstring = `<a>${text}</a>`;
    const jObj = parser.parse(xmlstring);
    const result = jObj.a.b;
    return Array.isArray(result) ? jObj.a.b[index] : jObj.a.b;
};

const GetTextListFromXML = function (text: string): string[] {
    const parser = new XMLParser();
    const xmlstring = `<a>${text}</a>`;
    const jObj = parser.parse(xmlstring);
    const result = jObj.a.b;
    return Array.isArray(result)
        ? [...jObj.a.b]
        : Number.isInteger(result)
        ? [String(jObj.a.b)]
        : [jObj.a.b];
};

const Converter = function <T>(response: T) {
    const reports: Report[] = [];
    let d: any;
    if (typeof response == 'string') {
        d = JSON.parse(response);
    } else {
        d = response;
    }
    if (!d.data) {
        throw '报告格式错误.';
    }
    try {
        for (let Difficulty in d.data) {
            for (let data of d.data[Difficulty]) {
                //Create a template from response body.
                let reportTemplate: Report = {
                    theme: 2,
                    mode: data.initial.modeName,
                    brief: {
                        duration: data.brief.duration,
                        endAt: data.brief.endAt,
                        squad: data.brief.squadName,
                        ending: data.brief.ending
                    },
                    recruits: data.recruits.reduce((a: Recruit[], c: any) => {
                        a.push({
                            upgraded: false,
                            name: c.name
                        });
                        return a;
                    }, []),
                    initial: {
                        recruitGroup: data.initial.recruitGroup,
                        recruits: data.initial.recruitInfos.reduce(
                            (a: string[], c: string) => {
                                a.push(GetTextFromXML(c));
                                return a;
                            },
                            []
                        ),
                        support: data.initial.support ?? ''
                    },
                    collections: [],
                    zones: []
                };
                //Parse body's field.
                //Upgrade characters in initial band.
                reportTemplate.recruits.forEach(character => {
                    character.upgraded =
                        (bandMap
                            .get(reportTemplate.brief.squad)
                            ?.indexOf(GetCharacterPro(character.name)) ?? -1) >=
                        0
                            ? GetCharacterRare(character.name) >= 3
                            : false;
                });
                if (data.initial.support == '随手拿点啥') {
                    reportTemplate.collections.push('热水壶');
                }
                for (let zone of data.zones) {
                    let zoneTemplate: Zone = {
                        enterZone: GetTextFromXML(zone.enterZone),
                        variations: zone.variations.reduce(
                            (a: string[], c: any) => {
                                a.push(c.name);
                                return a;
                            },
                            []
                        ),
                        nodeList: []
                    };
                    for (let node of zone.nodeList) {
                        let nodeTemplate: Node = {
                            type: node.type,
                            stage: Stageid(GetTextFromXML(node.title)) ?? '',
                            select: GetTextListFromXML(node.description) ?? [],
                            collections: node.collections.reduce(
                                (a: string[], c: string) => {
                                    a.push(GetTextFromXML(c));
                                    return a;
                                },
                                []
                            ),
                            capsules: node.capsules.reduce(
                                (a: string[], c: string) => {
                                    a.push(GetTextFromXML(c));
                                    return a;
                                },
                                []
                            ),
                            tools: node.tools.reduce(
                                (a: string[], c: string) => {
                                    a.push(GetTextFromXML(c));
                                    return a;
                                },
                                []
                            ),
                            tickets: node.tickets.reduce(
                                (a: string[], c: string) => {
                                    a.push(GetTextFromXML(c));
                                    return a;
                                },
                                []
                            ),
                            recruits: node.recruits.reduce(
                                (a: string[], c: string) => {
                                    a.push(GetTextFromXML(c));
                                    return a;
                                },
                                []
                            ),
                            upgrades: node.upgrades.reduce(
                                (a: string[], c: string) => {
                                    a.push(GetTextFromXML(c));
                                    return a;
                                },
                                []
                            ),
                            shop: {
                                buys: node.shop
                                    ? node.shop.buys.reduce(
                                          (a: BuyItem[], c: any) => {
                                              reportTemplate.collections.push(
                                                  GetTextFromXML(c, 1)
                                              );
                                              a.push({
                                                  cost: Number(
                                                      GetTextFromXML(c, 0)
                                                  ),
                                                  collection: GetTextFromXML(
                                                      c,
                                                      1
                                                  )
                                              });
                                              return a;
                                          },
                                          []
                                      )
                                    : [],
                                invest: node.shop
                                    ? node.shop.invest
                                        ? Number(
                                              GetTextFromXML(node.shop.invest)
                                          )
                                        : 0
                                    : 0
                            }
                        };
                        reportTemplate.collections = [
                            ...reportTemplate.collections,
                            ...nodeTemplate.collections
                        ];
                        //Upgrade characters in "upgrades" field.
                        nodeTemplate.upgrades.forEach(character => {
                            let index = reportTemplate.recruits.findIndex(c => {
                                return c.name == character;
                            });
                            if (index != -1) {
                                reportTemplate.recruits[index].upgraded = true;
                            }
                        });
                        zoneTemplate.nodeList.push(nodeTemplate);
                    }
                    reportTemplate.zones.push(zoneTemplate);
                }
                reports.push(reportTemplate);
            }
        }
    } catch (err) {
        throw '报告格式错误.';
    }
    return reports;
};

export default Converter;
