import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { onValue, ref } from "firebase/database"

import { db } from "@/app/config"

type BebedouroProps = {
  capacidade?: number;
  id?: number;
  local?: string;
  setor?: string,
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

          // Validações para a aparição dos elementos de acordo com a porcentagem
          return (
            <View style={styles.tank} key={index}>

              {
                porcentagem <= 60 &&
                item.volume &&
                item.capacidade &&
                <Text style={styles.percentTop}>{porcentagem}%</Text>
              }
              {
                porcentagem <= 60
                  ? <View style={styles.cardTop}>
                    <Text style={styles.info}>{item.id}</Text>
                    <Text style={styles.title}>{item.setor}</Text>
                    <Text style={styles.info}>{item.local}</Text>
                    <Text style={styles.info}>Capacidade: {item.capacidade}ml</Text>
                    <Text style={styles.info}>Volume: {item.volume}ml</Text>
                  </View>
                  : <View />
              }

              <View style={{ height: `${porcentagem}%`, width: '100%', backgroundColor: '#32bafa' }}>
                {
                  porcentagem > 60
                    ? <View style={styles.cardBottom}>
                      <Text style={styles.info}>{item.id}</Text>
                      <Text style={styles.subtitle}>{item.setor}</Text>
                      <Text style={styles.title}>{item.local}</Text>
                      <Text style={styles.info}>Capacidade: {item.capacidade}ml</Text>
                      <Text style={styles.info}>Volume: {item.volume}ml</Text>
                    </View>
                    : <View />
                }
                {
                  porcentagem > 60 &&
                  item.volume &&
                  item.capacidade &&
                  <Text style={styles.percentBottom}>{porcentagem}%</Text>
                }
              </View>
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
    justifyContent: 'flex-end',
    backgroundColor: '#F7F4F2',
    height: '100%',
    borderWidth: 6,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderColor: '#1e384c'
  },
  cardBottom: {
    width: 290,
    marginTop: 24,
    padding: 16,
    marginHorizontal: 24,
    borderRadius: 24,
    backgroundColor: '#32bafa',
    borderWidth: 6,
    borderColor: '#71cdf9',
    position: 'relative',
  },
  cardTop: {
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
  title: {
    marginBottom: 12,
    fontSize: 36,
    fontWeight: 600,
    textAlign: 'center',
    color: '#FFFFFF'
  },
  subtitle: {
    marginTop: 12,
    marginBottom: -6,
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center',
    paddingVertical: 6,
    color: '#FFFFFF'
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF'
  },
  percentBottom: {
    textAlign: 'center',
    fontSize: 80,
    marginTop: 16,
    color: '#F7F4F2'
  },
  percentTop: {
    textAlign: 'center',
    fontSize: 80,
    marginBottom: 16,
    color: '#32bafa'
  }
})
