  import { useEffect, useState } from "react"
  import { StyleSheet, Text, View } from "react-native"
  import { onValue, ref } from "firebase/database"

  import { db } from "@/app/config"
  import Wave from "react-wavify";

  type BebedouroProps = {
    capacidade?: number;
    id?: number;
    nome?: string;
    volume?: number;
  };

  const DBFetch = () => {

    const [bebedouros, setBebedouros] = useState<BebedouroProps[]>([])
    const [refresh, setRefresh] = useState(0)

    // useEffect que atualiza uma variável a cada 5 segundos
    // https://upmostly.com/tutorials/setinterval-in-react-components-using-hooks
    useEffect(() => {
      const interval = setInterval(() => {
        setRefresh(refresh + 1)
      }, 5000);
      return () => clearInterval(interval);
    }, [refresh]);

    // Consulta ao Realtime Database. Este useEffect é chamado sempre que a variável "refresh" for alterada
    useEffect(() => {
      const dbRef = ref(db, '/')
      onValue(dbRef, (snapshot) => {
        const dados = snapshot.val()
        const novosPosts = Object.keys(dados).map(key => ({
          id: key,
          ...dados[key]
        }))
        console.log(novosPosts)
        setBebedouros(novosPosts)
      })
    }, [refresh])

    return (
      <View style={styles.container}>

        {
          // Mapeamento dos bebedouros
          bebedouros && bebedouros.map((item, index) => {

            // Cálculo da porcentagem
            let porcentagem = item.volume && item.capacidade ? ((100 * item.volume) / item.capacidade) : 0
            let agua = 0
            switch (true) {
              case porcentagem <= 5:
                agua = 1000
                break
              case porcentagem <= 10:
                agua = 900
                break
              case porcentagem <= 20:
                agua = 800
                break
              case porcentagem <= 30:
                agua = 700
                break
              case porcentagem <= 40:
                agua = 600
                break
              case porcentagem <= 50:
                agua = 500
                break
              case porcentagem <= 60:
                agua = 400
                break
              case porcentagem <= 70:
                agua = 300
                break
              case porcentagem <= 80:
                agua = 200
                break
              case porcentagem <= 90:
                agua = 100
                break
              case porcentagem <= 100:
                agua = 10
                break
              default:
                agua = 10
                break
            }

            return (
              <View style={styles.tank} key={index}>
                  <Wave fill='#32bafa'
                    paused={false}
                    style={{ display: 'flex', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden'}}
                    options={{
                      height: agua,
                      amplitude: 30,
                      speed: 0.15,
                      points: 3
                    }}
                  />

                {
                  item.volume && item.capacidade &&
                    <View style={{
                      ...styles.card,
                      backgroundColor: porcentagem <= 10 ? '#d1284f' : porcentagem <= 20 ? '#F68B36' : '#32BAFA',
                      borderColor: porcentagem <= 10 ? '#fa4069' : porcentagem <= 20 ? '#ffc994' : '#71CDF9'
                    }}>
                      <Text style={styles.percent}>{porcentagem}%</Text>
                      <Text style={styles.title}>{item.nome}</Text>
                      <Text style={styles.info}>Capacidade: {item.capacidade}ml</Text>
                      <Text style={styles.info}>Volume: {item.volume}ml</Text>
                    </View>
                }
              </View>
            )
          })
        }

      </View>
    )
  }

  export default DBFetch

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F7F4F2'
    },
    tank: {
      justifyContent: 'center',
      backgroundColor: '#F7F4F2',
      height: '100%',
      borderWidth: 6,
      borderTopWidth: 12,
      borderBottomWidth: 12,
      borderColor: '#1e384c'
    },
    card: {
      width: 290,
      marginBottom: 24,
      padding: 16,
      marginHorizontal: 24,
      borderRadius: 24,
      backgroundColor: '#32bafa',
      borderWidth: 6,
      borderColor: '#71cdf9',
      position: 'relative',
    },

    percent: {
      textAlign: 'center',
      fontSize: 80,
      color: '#F7F4F2'
    },
    title: {
      fontSize: 36,
      fontWeight: 600,
      textAlign: 'center',
      color: '#FFFFFF'
    },
    info: {
      fontSize: 16,
      textAlign: 'center',
      color: '#FFFFFF'
    },
  })
