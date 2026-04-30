import React from 'react';
import {Text} from 'react-native';

type Props = {name: string};

const Hello: React.FC<Props> = ({name}) => {
  return <Text>Hello, {name}!</Text>;
};

export default Hello;
